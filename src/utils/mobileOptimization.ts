/**
 * Утилиты для оптимизации на мобильных устройствах
 * Специальная поддержка для Android и Huawei
 */

export interface DeviceInfo {
  isMobile: boolean;
  isAndroid: boolean;
  isHuawei: boolean;
  isTablet: boolean;
  screenSize: 'small' | 'medium' | 'large';
  hasTouch: boolean;
  performance: 'low' | 'medium' | 'high';
}

export class MobileOptimizer {
  
  // Определение типа устройства
  static detectDevice(): DeviceInfo {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isHuawei = /huawei|honor|nova|mate|p\d+|y\d+/.test(userAgent) || 
                     /hmos|harmonyos/.test(userAgent) ||
                     window.navigator.appVersion.includes('HMSCore');
    
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
    
    // Определяем размер экрана
    const screenWidth = window.screen.width;
    let screenSize: 'small' | 'medium' | 'large' = 'medium';
    if (screenWidth < 480) screenSize = 'small';
    else if (screenWidth > 1024) screenSize = 'large';
    
    // Определяем производительность устройства
    const performance = this.detectPerformance();
    
    return {
      isMobile,
      isAndroid,
      isHuawei,
      isTablet,
      screenSize,
      hasTouch: 'ontouchstart' in window,
      performance
    };
  }

  // Определение производительности устройства
  private static detectPerformance(): 'low' | 'medium' | 'high' {
    // Проверяем количество ядер процессора
    const cores = navigator.hardwareConcurrency || 2;
    
    // Проверяем объем памяти (если доступно)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Простая эвристика для определения производительности
    if (cores >= 8 && memory >= 8) return 'high';
    if (cores >= 4 && memory >= 4) return 'medium';
    return 'low';
  }

  // Оптимизация для Huawei устройств
  static applyHuaweiOptimizations() {
    const deviceInfo = this.detectDevice();
    
    if (deviceInfo.isHuawei) {
      // Оптимизации специфичные для Huawei
      this.enableHarmonyOSFeatures();
      this.optimizeForHMSCore();
      this.adjustForHuaweiUI();
    }
  }

  // Включение функций HarmonyOS
  private static enableHarmonyOSFeatures() {
    // Проверяем поддержку HarmonyOS API
    if (typeof (window as any).HarmonyOS !== 'undefined') {
      console.log('HarmonyOS API доступно');
      
      // Настройка темы для HarmonyOS
      document.documentElement.setAttribute('data-harmony-theme', 'auto');
      
      // Оптимизация жестов для HarmonyOS
      this.setupHarmonyGestures();
    }
  }

  // Оптимизация для HMS Core
  private static optimizeForHMSCore() {
    // Проверяем наличие HMS Core
    if (typeof (window as any).HMSCore !== 'undefined') {
      console.log('HMS Core доступен');
      
      // Используем Huawei Push Kit вместо FCM
      this.setupHuaweiPush();
      
      // Интеграция с Huawei Analytics
      this.setupHuaweiAnalytics();
    }
  }

  // Настройка UI для Huawei устройств
  private static adjustForHuaweiUI() {
    // Добавляем специальные стили для EMUI/Magic UI
    const style = document.createElement('style');
    style.textContent = `
      /* Оптимизация для EMUI/Magic UI */
      .mobile-huawei {
        /* Увеличенные области касания */
        --touch-target: 48px;
        
        /* Адаптированные цвета для темной темы EMUI */
        --huawei-primary: #007DFF;
        --huawei-bg: #1A1A1A;
        --huawei-surface: #2D2D2D;
      }
      
      /* Специальные стили для складных устройств Huawei */
      @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
        .foldable-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
      }
      
      /* Оптимизация для уведомлений в EMUI */
      .huawei-notification {
        border-radius: 12px;
        backdrop-filter: blur(20px);
        background: rgba(0, 125, 255, 0.1);
      }
    `;
    document.head.appendChild(style);
    
    // Добавляем класс для Huawei устройств
    document.body.classList.add('mobile-huawei');
  }

  // Настройка жестов для HarmonyOS
  private static setupHarmonyGestures() {
    // Поддержка трехпальцевых жестов HarmonyOS
    let touchCount = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchCount = e.touches.length;
      
      // Трехпальцевое касание для скриншота экрана
      if (touchCount === 3) {
        this.handleHarmonyScreenshot();
      }
    });
    
    // Поддержка жеста "костяшкой пальца"
    document.addEventListener('touchstart', (e) => {
      // Эмуляция определения касания костяшкой
      if (e.touches.length === 1 && (e.touches[0] as any).force > 0.8) {
        this.handleKnuckleGesture(e);
      }
    });
  }

  // Обработка скриншота в HarmonyOS
  private static handleHarmonyScreenshot() {
    if (typeof (window as any).HarmonyOS?.screenshot === 'function') {
      (window as any).HarmonyOS.screenshot();
    } else {
      // Fallback для веб-приложений
      this.webScreenshot();
    }
  }

  // Веб-скриншот для браузера
  private static async webScreenshot() {
    try {
      if ('getDisplayMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          
          // Скачиваем скриншот
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `ai-ide-screenshot-${Date.now()}.png`;
              a.click();
              URL.revokeObjectURL(url);
            }
          });
          
          stream.getTracks().forEach(track => track.stop());
        });
      }
    } catch (error) {
      console.log('Скриншот недоступен в данном браузере');
    }
  }

  // Обработка жеста костяшкой пальца
  private static handleKnuckleGesture(event: TouchEvent) {
    // Различные действия для разных жестов
    const touch = event.touches[0];
    const rect = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (rect?.closest('.monaco-editor')) {
      // В редакторе кода - автодополнение
      this.triggerCodeAutocomplete();
    } else if (rect?.closest('.chat-container')) {
      // В чате - быстрая отправка
      this.triggerQuickSend();
    }
  }

  // Настройка Huawei Push Kit
  private static setupHuaweiPush() {
    if (typeof (window as any).HMSPush !== 'undefined') {
      // Инициализация Huawei Push Kit
      (window as any).HMSPush.init({
        onTokenReceived: (token: string) => {
          console.log('Huawei Push Token:', token);
          // Сохраняем токен для отправки уведомлений
          localStorage.setItem('huawei_push_token', token);
        },
        onMessageReceived: (message: any) => {
          console.log('Получено push уведомление:', message);
          this.displayHuaweiNotification(message);
        }
      });
    }
  }

  // Настройка Huawei Analytics
  private static setupHuaweiAnalytics() {
    if (typeof (window as any).HiAnalytics !== 'undefined') {
      (window as any).HiAnalytics.getInstance().setUserId('ai_ide_user');
      
      // Отправляем события использования
      this.trackHuaweiEvent('app_start', {
        device_model: navigator.userAgent,
        timestamp: Date.now()
      });
    }
  }

  // Отображение уведомления в стиле Huawei
  private static displayHuaweiNotification(message: any) {
    const notification = document.createElement('div');
    notification.className = 'huawei-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>${message.title}</h4>
        <p>${message.body}</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Трекинг событий для Huawei Analytics
  private static trackHuaweiEvent(eventName: string, parameters: any) {
    if (typeof (window as any).HiAnalytics !== 'undefined') {
      (window as any).HiAnalytics.getInstance().onEvent(eventName, parameters);
    }
  }

  // Оптимизация производительности для слабых устройств
  static optimizeForLowPerformance() {
    const deviceInfo = this.detectDevice();
    
    if (deviceInfo.performance === 'low') {
      // Отключаем анимации
      document.documentElement.style.setProperty('--animation-duration', '0s');
      
      // Упрощаем интерфейс
      document.body.classList.add('low-performance');
      
      // Ограничиваем количество одновременных запросов
      this.setupRequestThrottling();
      
      // Оптимизируем Monaco Editor
      this.optimizeMonacoForLowEnd();
    }
  }

  // Настройка ограничения запросов
  private static setupRequestThrottling() {
    let activeRequests = 0;
    const maxRequests = 2;
    
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      // Ждем, пока не освободится слот
      while (activeRequests >= maxRequests) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      activeRequests++;
      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        activeRequests--;
      }
    };
  }

  // Оптимизация Monaco Editor для слабых устройств
  private static optimizeMonacoForLowEnd() {
    // Настройки будут применены через Monaco API
    (window as any).monacoOptimizations = {
      wordWrap: 'off',
      minimap: { enabled: false },
      renderWhitespace: 'none',
      renderControlCharacters: false,
      renderIndentGuides: false,
      occurrencesHighlight: false,
      selectionHighlight: false,
      codeLens: false,
      folding: false,
      foldingHighlight: false,
      unfoldOnClickAfterEndOfLine: false,
      lineDecorationsWidth: 0,
      glyphMargin: false,
      lineNumbersMinChars: 3,
      scrollBeyondLastLine: false,
      smoothScrolling: false,
      contextmenu: false,
      mouseWheelZoom: false,
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: 'off',
      parameterHints: { enabled: false },
      autoIndent: 'none',
      formatOnType: false,
      formatOnPaste: false,
      dragAndDrop: false,
      links: false,
      colorDecorators: false
    };
  }

  // Адаптивная загрузка контента
  static setupAdaptiveLoading() {
    const deviceInfo = this.detectDevice();
    
    // Ленивая загрузка для изображений
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
    
    // Предварительная загрузка критических ресурсов
    if (deviceInfo.performance !== 'low') {
      this.preloadCriticalAssets();
    }
  }

  // Предварительная загрузка критических ресурсов
  private static preloadCriticalAssets() {
    const criticalAssets = [
      '/monaco-editor/vs/loader.js',
      '/fonts/Inter-Regular.woff2'
    ];
    
    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.as = asset.includes('.js') ? 'script' : 'font';
      if (link.as === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  // Активация всех мобильных оптимизаций
  static activate() {
    const deviceInfo = this.detectDevice();
    
    if (deviceInfo.isMobile) {
      // Базовые мобильные оптимизации
      this.setupMobileViewport();
      this.setupTouchOptimizations();
      this.setupAdaptiveLoading();
      this.optimizeForLowPerformance();
      
      // Специфичные оптимизации для Huawei
      if (deviceInfo.isHuawei) {
        this.applyHuaweiOptimizations();
      }
      
      console.log('Мобильные оптимизации активированы:', deviceInfo);
    }
  }

  // Настройка viewport для мобильных устройств
  private static setupMobileViewport() {
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  }

  // Оптимизация для сенсорного ввода
  private static setupTouchOptimizations() {
    // Увеличиваем области касания
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        button, .clickable {
          min-height: 44px;
          min-width: 44px;
          padding: 12px;
        }
        
        input, textarea, select {
          font-size: 16px; /* Предотвращает зум в iOS */
          padding: 12px;
        }
        
        /* Отключаем выделение текста на кнопках */
        button, .btn {
          -webkit-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Плавная прокрутка */
        * {
          -webkit-overflow-scrolling: touch;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Вспомогательные методы
  private static triggerCodeAutocomplete() {
    // Эмулируем Ctrl+Space для автодополнения
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      ctrlKey: true,
      bubbles: true
    });
    document.activeElement?.dispatchEvent(event);
  }

  private static triggerQuickSend() {
    // Находим и нажимаем кнопку отправки в чате
    const sendButton = document.querySelector('[data-send-button]') as HTMLButtonElement;
    if (sendButton) {
      sendButton.click();
    }
  }
}