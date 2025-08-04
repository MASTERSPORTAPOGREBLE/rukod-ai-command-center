# 📱 Руководство по созданию APK для AI IDE

## 🚀 Быстрый старт

### Автоматическая сборка (рекомендуется)

```bash
# Одна команда для всего!
npm run build:apk
```

Скрипт автоматически:
- ✅ Установит зависимости
- ✅ Соберет веб-версию  
- ✅ Настроит Capacitor
- ✅ Создаст APK файл
- ✅ Откроет Android Studio (если нужно)

## 📋 Требования

### Обязательные

1. **Node.js** (версия 16+)
   ```bash
   # Проверить версию
   node --version
   npm --version
   ```

2. **Android Studio** 
   - Скачать: [developer.android.com](https://developer.android.com/studio)
   - Установить Android SDK
   - Настроить переменную `ANDROID_HOME`

### Настройка Android SDK

```bash
# Добавить в ~/.bashrc или ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Перезагрузить терминал
source ~/.bashrc
```

## 🛠️ Пошаговая инструкция

### Шаг 1: Подготовка проекта

```bash
# Клонировать проект
git clone <your-repo>
cd ai-ide

# Установить зависимости
npm install

# Настроить API ключ Gemini в .env
echo "VITE_GEMINI_API_KEY=API_GMN" > .env
```

### Шаг 2: Сборка веб-версии

```bash
# Собрать для продакшена
npm run build

# Проверить что папка dist создана
ls -la dist/
```

### Шаг 3: Настройка Capacitor

```bash
# Инициализация (если еще не сделано)
npm run cap:init

# Добавить Android платформу
npm run cap:add

# Синхронизировать
npm run cap:sync
```

### Шаг 4: Создание APK

#### Вариант A: Автоматически

```bash
npm run build:apk
```

#### Вариант B: Вручную через Android Studio

```bash
# Открыть Android Studio
npm run cap:open

# В Android Studio:
# 1. Build > Generate Signed Bundle/APK
# 2. Выбрать APK
# 3. Create new keystore (если нет)
# 4. Build
```

#### Вариант C: Через командную строку

```bash
cd android

# Debug APK (для тестирования)
./gradlew assembleDebug

# Release APK (для публикации)
./gradlew assembleRelease
```

## 📁 Расположение файлов APK

После сборки APK файлы будут в:

```
📦 Проект
├── ai-ide-debug.apk        # Debug версия (в корне)
├── ai-ide-release.apk      # Release версия (в корне)  
└── android/
    └── app/build/outputs/apk/
        ├── debug/
        │   └── app-debug.apk
        └── release/
            └── app-release.apk
```

## 🔐 Создание Keystore для Release

```bash
# Создать keystore (делается один раз)
keytool -genkey -v -keystore android/app/release.keystore \
    -alias ai-ide \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000

# Настроить в android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword 'your_store_password'
            keyAlias 'ai-ide'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## 📱 Установка APK на устройство

### Через ADB

```bash
# Подключить устройство через USB
# Включить "Отладка по USB" в настройках разработчика

# Установить APK
adb install ai-ide-debug.apk

# Или принудительно переустановить
adb install -r ai-ide-debug.apk
```

### Через файловый менеджер

1. Скопировать APK на устройство
2. Открыть файловый менеджер
3. Нажать на APK файл
4. Разрешить установку из неизвестных источников
5. Установить

## 🌐 PWA альтернатива (без APK)

Если APK создать сложно, можно использовать как PWA:

```bash
# Собрать PWA версию
npm run build:pwa

# Запустить локально
npm run serve

# Открыть в браузере на телефоне
# http://your-ip:4173

# Добавить на главный экран через браузер
```

## 🔧 Решение проблем

### Ошибка: "ANDROID_HOME not set"

```bash
# Найти путь к Android SDK
find ~ -name "android" -type d 2>/dev/null | grep Sdk

# Добавить в .bashrc/.zshrc
export ANDROID_HOME=/path/to/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Перезапустить терминал
```

### Ошибка: "SDK not found"

```bash
# Открыть Android Studio
# Tools > SDK Manager
# Установить нужные SDK (API 30+)
```

### Ошибка сборки Gradle

```bash
# Очистить кэш
cd android
./gradlew clean

# Пересобрать
./gradlew assembleDebug
```

### APK не устанавливается

```bash
# Проверить архитектуру
adb shell getprop ro.product.cpu.abi

# Пересобрать под нужную архитектуру
# В android/app/build.gradle добавить:
android {
    defaultConfig {
        ndk {
            abiFilters "arm64-v8a", "armeabi-v7a", "x86", "x86_64"
        }
    }
}
```

## 📊 Размер APK

Оптимизация размера APK:

```bash
# Анализ размера
cd android
./gradlew analyzeDebugBundle

# Включить ProGuard для уменьшения размера
# В android/app/build.gradle:
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 🚀 Продвинутые функции

### Автоматическое обновление

```javascript
// В src/main.tsx добавить
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('SW registered'))
    .catch(() => console.log('SW failed'));
}
```

### Push уведомления

```bash
# Добавить плагин
npm install @capacitor/push-notifications

# Настроить в capacitor.config.ts
plugins: {
  PushNotifications: {
    presentationOptions: ["badge", "sound", "alert"]
  }
}
```

### Хранение данных

```bash
# Добавить плагин
npm install @capacitor/preferences

# Использовать
import { Preferences } from '@capacitor/preferences';

await Preferences.set({
  key: 'project_data',
  value: JSON.stringify(projectData)
});
```

## 📋 Чек-лист готовности APK

- [ ] ✅ Node.js установлен
- [ ] ✅ Android Studio настроен
- [ ] ✅ ANDROID_HOME настроен
- [ ] ✅ Gemini API ключ добавлен в .env
- [ ] ✅ Проект собирается (`npm run build`)
- [ ] ✅ Capacitor настроен
- [ ] ✅ APK создается без ошибок
- [ ] ✅ APK устанавливается на устройство
- [ ] ✅ Приложение запускается
- [ ] ✅ Основные функции работают

## 🎯 Быстрые команды

```bash
# Полная пересборка
npm run build:apk

# Только синхронизация
npm run cap:sync

# Открыть Android Studio
npm run cap:open

# Запуск на устройстве с live reload
npm run android:dev

# Установка APK
adb install ai-ide-debug.apk

# Просмотр логов
adb logcat | grep -i "ai-ide"
```

---

## 🎉 Готово!

После выполнения всех шагов у вас будет:

- 📱 **APK файл** для установки на Android
- 🌐 **PWA версия** для браузера  
- 🔄 **Автоматические обновления**
- 📊 **Оффлайн режим**
- 🤖 **Полная функциональность AI IDE**

**Ваша AI IDE теперь работает как настоящее мобильное приложение! 🚀**

---

*Если возникли проблемы, проверьте [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) для дополнительной информации.*