# 🚀 Расширенные функции AI IDE

## 🤖 Мультимодельный ИИ

### Поддерживаемые модели

#### 1. **Gemini 2.5 Flash** (Google)
- **Статус**: Основная модель
- **API ключ**: `VITE_GEMINI_API_KEY`
- **Возможности**: Генерация кода, чат, анализ проектов
- **Получение ключа**: [Google AI Studio](https://makersuite.google.com/app/apikey)

#### 2. **DeepSeek Coder** (бесплатный! 🎉)
- **Статус**: Специализация на коде
- **API ключ**: `VITE_DEEPSEEK_API_KEY`
- **Возможности**: Генерация кода, рефакторинг, отладка
- **Получение ключа**: [DeepSeek Platform](https://platform.deepseek.com/)
- **Лимиты**: Бесплатно до 10M токенов/месяц

#### 3. **Qwen Coder** (бесплатный! 🎉)  
- **Статус**: Китайская модель
- **API ключ**: `VITE_QWEN_API_KEY`
- **Возможности**: Кодинг, перевод, анализ
- **Получение ключа**: [DashScope](https://dashscope.aliyun.com/)
- **Особенности**: Отлично работает с восточными языками

### Переключение между моделями

```typescript
// В коде
const aiService = new UniversalAIService();
aiService.setActiveProvider('deepseek'); // или 'qwen', 'gemini'

// В интерфейсе
// Выберите модель в настройках чата
```

## 🎨 Генерация изображений

### Бесплатные сервисы

#### 1. **Hugging Face** (рекомендуется)
- **API ключ**: `VITE_HUGGINGFACE_API_KEY` 
- **Модель**: Stable Diffusion XL
- **Получение**: [Hugging Face](https://huggingface.co/settings/tokens)
- **Лимиты**: 1000 запросов/месяц бесплатно

#### 2. **Pollinations.ai** (без ключа!)
- **Статус**: Полностью бесплатно
- **Ограничения**: Нет
- **Автоматический фолбэк**: Включается если нет HF ключа

### Использование

```typescript
// Генерация изображения
const imageUrl = await ImageService.generateImage(
  "fantasy castle texture for game", 
  { 
    size: '512x512', 
    style: 'texture' 
  }
);

// Готовые текстуры для игр
const stoneTexture = await ImageService.generateGameTexture('stone', '1024x1024');
```

### Примеры промптов

```
🎮 Игровые ресурсы:
- "seamless brick wall texture for medieval game"
- "pixel art character sprite 32x32"
- "fantasy sword icon game asset"

🎨 UI элементы:
- "modern button design mobile app"
- "colorful game UI panel"
- "minimalist icon set"
```

## 🛠️ Автоматический рефакторинг

### Что анализируется

1. **Неиспользуемый код**
   - Импорты
   - Функции
   - Переменные

2. **Дублирующийся код**
   - Похожие функции
   - Повторяющаяся логика

3. **Проблемы производительности**
   - Вложенные циклы
   - Синхронные операции в циклах

4. **Структурные проблемы**
   - Длинные функции (>50 строк)
   - Много параметров (>5)

5. **Безопасность**
   - Использование `eval()`
   - Небезопасный `innerHTML`

### Использование

```typescript
// Анализ проекта
const refactoringService = new RefactoringService();
const report = await refactoringService.analyzeProject(files);

console.log(`Найдено проблем: ${report.issues.length}`);
console.log(`Оценка качества: ${report.codeQualityScore}/100`);

// Автоматический рефакторинг
const result = await refactoringService.autoRefactor(files);
console.log(result.summary);
```

### Интерфейс

- Кнопка "🔧 Анализ проекта" в файловом менеджере
- Отчет с найденными проблемами
- Выбор проблем для исправления
- Автоматическое применение изменений

## 📱 Оптимизация для мобильных

### Поддерживаемые устройства

- ✅ **Android** (все версии)
- ✅ **Huawei** (EMUI, Magic UI, HarmonyOS)
- ✅ **iOS/iPad** (Safari)
- ✅ **Складные устройства**

### Специальные функции для Huawei

#### HarmonyOS жесты
- **Трехпальцевый тап**: Скриншот экрана
- **Костяшка пальца**: Контекстные действия
  - В редакторе → автодополнение
  - В чате → быстрая отправка

#### HMS Core интеграция
```typescript
// Автоматически определяется и настраивается
if (MobileOptimizer.detectDevice().isHuawei) {
  // Huawei Push Kit
  // Huawei Analytics  
  // Оптимизированная тема EMUI
}
```

### Производительность

#### Для слабых устройств автоматически:
- Отключаются анимации
- Упрощается интерфейс
- Ограничиваются запросы
- Оптимизируется Monaco Editor

#### Ручная настройка:
```typescript
// В .env
VITE_MOBILE_PERFORMANCE=low  // low, medium, high
```

## 🖼️ Фоторедактирование

### Background Eraser

```typescript
// Удаление фона
const imageWithoutBg = await ImageService.removeBackground(imageDataUrl);

// API варианты:
// 1. Remove.bg API (платный, точный)
// 2. Локальный алгоритм (бесплатный, базовый)
```

### PhotoLayers

```typescript
// Наложение слоев
const blendedImage = await ImageService.blendImages(
  baseImage,
  overlayImage,
  {
    blendMode: 'overlay',
    opacity: 0.7
  }
);
```

### Оптимизация изображений

```typescript
// Для веба
const optimized = await ImageService.optimizeForWeb(imageUrl, 0.8);

// Изменение размера
const resized = await ImageService.resizeImage(imageUrl, 800, 600);
```

## ⚙️ Настройка переменных окружения

### Полный список .env

```bash
# ========================================
# ИИ МОДЕЛИ (выберите одну или несколько)
# ========================================

# Gemini (Google) - основная модель
VITE_GEMINI_API_KEY=AIza_your_key_here

# DeepSeek - бесплатная модель для кода  
VITE_DEEPSEEK_API_KEY=sk-your_key_here

# Qwen - китайская модель
VITE_QWEN_API_KEY=sk-your_key_here

# ========================================
# ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ (опционально)
# ========================================

# Hugging Face - рекомендуется
VITE_HUGGINGFACE_API_KEY=hf_your_key_here

# Stability AI (если есть)
VITE_STABILITY_API_KEY=sk-your_key_here

# ========================================
# ФОТОРЕДАКТИРОВАНИЕ (опционально)
# ========================================

# Remove.bg для точного удаления фона
VITE_REMOVE_BG_API_KEY=your_key_here

# ========================================
# ОБЛАЧНЫЕ ИНТЕГРАЦИИ (опционально)
# ========================================

# Replit для развертывания
VITE_REPLIT_TOKEN=your_token_here

# GitHub для репозиториев
VITE_GITHUB_TOKEN=ghp_your_token_here

# ========================================
# БЕЗОПАСНОСТЬ
# ========================================

# Ключ шифрования (обязательно смените!)
VITE_ENCRYPTION_KEY=your_unique_encryption_key_2024

# ========================================
# ПРОИЗВОДИТЕЛЬНОСТЬ (опционально)
# ========================================

# Уровень производительности: low, medium, high
VITE_MOBILE_PERFORMANCE=auto
```

## 🎯 Специальные команды для ИИ

### Генерация игровых ресурсов

```
Создай пиксельную текстуру камня 64x64 для 2D игры
```

```
Сгенерируй набор иконок для RPG игры: меч, щит, зелье, монета
```

### Рефакторинг кода

```
Проанализируй этот React компонент и предложи улучшения
```

```
Оптимизируй этот код для лучшей производительности
```

### Создание приложений

```
Создай мобильное приложение для заметок на React Native
```

```
Напиши игру "Змейка" на HTML5 Canvas с сенсорным управлением
```

## 🔧 Отладка и решение проблем

### Проверка статуса ИИ моделей

```typescript
const aiService = new UniversalAIService();

// Проверяем доступность провайдеров
aiService.getAllProviders().forEach(provider => {
  const isConfigured = aiService.isProviderConfigured(provider.id);
  console.log(`${provider.name}: ${isConfigured ? '✅' : '❌'}`);
});
```

### Проверка мобильной оптимизации

```typescript
const deviceInfo = MobileOptimizer.detectDevice();
console.log('Информация об устройстве:', deviceInfo);

// Принудительная активация Huawei оптимизаций
if (deviceInfo.isHuawei) {
  MobileOptimizer.applyHuaweiOptimizations();
}
```

### Логи генерации изображений

```typescript
// Включаем подробные логи
localStorage.setItem('debug_image_generation', 'true');

// Проверяем доступные сервисы
console.log('Hugging Face:', !!getEnvApiKey('huggingface'));
console.log('Fallback (Pollinations):', 'Всегда доступен');
```

## 🚀 Советы по оптимизации

### Для Huawei устройств

1. **Используйте HarmonyOS жесты** - они интуитивно понятны пользователям
2. **Тестируйте на EMUI** - интерфейс может отличаться
3. **Проверяйте HMS Core** - дополнительные возможности

### Для слабых устройств

1. **Выбирайте DeepSeek** - быстрее чем Gemini
2. **Отключайте анимации** - автоматически или принудительно
3. **Используйте локальное редактирование** - вместо API сервисов

### Для генерации изображений

1. **Начните с Pollinations** - не требует ключей
2. **Переходите на Hugging Face** - лучшее качество
3. **Оптимизируйте промпты** - добавляйте "high quality, detailed"

---

**Теперь ваша AI IDE готова ко всем вызовам! 🎉**

*Создавайте, генерируйте, оптимизируйте - границ больше нет!*