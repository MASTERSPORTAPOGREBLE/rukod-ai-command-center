// AI IDE Service Worker для оффлайн режима
const CACHE_NAME = 'ai-ide-v1.0.0';
const OFFLINE_CACHE = 'ai-ide-offline-v1.0.0';

// Ресурсы для кэширования
const CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Добавятся автоматически при сборке
];

// Оффлайн страница
const OFFLINE_PAGE = '/offline.html';

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Основной кэш
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching resources');
        return cache.addAll(CACHE_RESOURCES);
      }),
      // Оффлайн кэш
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.add(OFFLINE_PAGE);
      })
    ])
  );
  
  // Принудительная активация нового SW
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    Promise.all([
      // Очистка старых кэшей
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Управление всеми клиентами
      self.clients.claim()
    ])
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Игнорируем запросы к API
  if (url.pathname.startsWith('/api/') || 
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('huggingface.co') ||
      url.hostname.includes('pollinations.ai')) {
    return handleApiRequest(event);
  }
  
  // Обрабатываем навигационные запросы
  if (request.mode === 'navigate') {
    return handleNavigationRequest(event);
  }
  
  // Обрабатываем статические ресурсы
  return handleStaticRequest(event);
});

// Обработка API запросов
function handleApiRequest(event) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Кэшируем успешные ответы API
        if (response.ok && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Возвращаем из кэша если есть
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Возвращаем оффлайн ответ для API
          return new Response(
            JSON.stringify({
              error: 'Оффлайн режим',
              message: 'API недоступно в оффлайн режиме',
              offline: true
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
      })
  );
}

// Обработка навигационных запросов
function handleNavigationRequest(event) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        // Возвращаем главную страницу из кэша
        return caches.match('/').then((cachedResponse) => {
          return cachedResponse || caches.match(OFFLINE_PAGE);
        });
      })
  );
}

// Обработка статических ресурсов
function handleStaticRequest(event) {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((response) => {
        // Кэшируем новые ресурсы
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
}

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_PROJECT':
      // Кэшируем проект для оффлайн работы
      cacheProject(data);
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then((status) => {
        event.ports[0].postMessage(status);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

// Кэширование проекта
async function cacheProject(projectData) {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Сохраняем данные проекта
    const projectResponse = new Response(JSON.stringify(projectData), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put('/cached-project', projectResponse);
    
    console.log('[SW] Project cached for offline use');
  } catch (error) {
    console.error('[SW] Error caching project:', error);
  }
}

// Получение статуса кэша
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const status = {
      available: cacheNames.length > 0,
      caches: cacheNames,
      size: 0
    };
    
    // Подсчитываем размер кэша
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      status.size += keys.length;
    }
    
    return status;
  } catch (error) {
    console.error('[SW] Error getting cache status:', error);
    return { available: false, error: error.message };
  }
}

// Очистка всех кэшей
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] All caches cleared');
  } catch (error) {
    console.error('[SW] Error clearing caches:', error);
    throw error;
  }
}

// Синхронизация в фоне
self.addEventListener('sync', (event) => {
  if (event.tag === 'project-sync') {
    event.waitUntil(syncProject());
  }
});

// Синхронизация проекта
async function syncProject() {
  try {
    // Получаем несинхронизированные данные
    const cache = await caches.open(CACHE_NAME);
    const pendingResponse = await cache.match('/pending-sync');
    
    if (pendingResponse) {
      const pendingData = await pendingResponse.json();
      
      // Отправляем на сервер
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingData)
      });
      
      if (response.ok) {
        // Удаляем из кэша после успешной синхронизации
        await cache.delete('/pending-sync');
        console.log('[SW] Project synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// Push уведомления
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'AI IDE уведомление',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'open',
        title: 'Открыть IDE',
        icon: '/icons/open.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icons/close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AI IDE', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Периодическая синхронизация (если поддерживается)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'project-backup') {
    event.waitUntil(performPeriodicBackup());
  }
});

// Периодическое резервное копирование
async function performPeriodicBackup() {
  try {
    // Получаем данные проекта
    const cache = await caches.open(CACHE_NAME);
    const projectResponse = await cache.match('/cached-project');
    
    if (projectResponse) {
      const projectData = await projectResponse.json();
      
      // Создаем резервную копию
      const backupData = {
        ...projectData,
        backupTimestamp: Date.now(),
        type: 'periodic-backup'
      };
      
      // Сохраняем локально
      const backupResponse = new Response(JSON.stringify(backupData), {
        headers: { 'Content-Type': 'application/json' }
      });
      
      await cache.put(`/backup-${Date.now()}`, backupResponse);
      
      console.log('[SW] Periodic backup created');
    }
  } catch (error) {
    console.error('[SW] Periodic backup failed:', error);
  }
}

console.log('[SW] Service Worker loaded');