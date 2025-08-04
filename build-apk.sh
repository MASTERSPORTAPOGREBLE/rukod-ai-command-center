#!/bin/bash

# 🚀 Скрипт для сборки AI IDE в APK
echo "🔥 Начинаем сборку AI IDE APK..."

# Проверяем зависимости
echo "📋 Проверяем зависимости..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен"
    exit 1
fi

# npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"  
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

# Собираем проект
echo "🏗️ Собираем веб-версию..."
npm run build

# Проверяем наличие папки dist
if [ ! -d "dist" ]; then
    echo "❌ Папка dist не найдена. Ошибка сборки."
    exit 1
fi

echo "✅ Веб-версия собрана"

# Инициализируем Capacitor (если еще не инициализирован)
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️ Инициализируем Capacitor..."
    npx cap init "AI IDE" "com.ai.ide.app" --web-dir=dist
fi

# Добавляем Android платформу (если еще не добавлена)
if [ ! -d "android" ]; then
    echo "📱 Добавляем Android платформу..."
    npx cap add android
fi

# Синхронизируем с платформой
echo "🔄 Синхронизируем с Android..."
npx cap sync android

# Копируем ресурсы
echo "📋 Копируем ресурсы..."
npx cap copy android

# Обновляем плагины
echo "🔌 Обновляем плагины..."
npx cap update android

echo "✅ Подготовка завершена!"

# Проверяем наличие Android SDK
echo "🔍 Проверяем Android SDK..."

if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️ ANDROID_HOME не установлен"
    echo "📝 Установите Android Studio и настройте ANDROID_HOME"
    echo "   export ANDROID_HOME=\$HOME/Android/Sdk"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/tools:\$ANDROID_HOME/platform-tools"
    
    echo ""
    echo "🎯 Для ручной сборки:"
    echo "   1. Откройте Android Studio"
    echo "   2. Откройте папку ./android"
    echo "   3. Нажмите Build > Generate Signed Bundle/APK"
    echo ""
    
    # Открываем Android Studio если возможно
    if command -v studio &> /dev/null; then
        echo "🚀 Открываем Android Studio..."
        studio android
    elif command -v android-studio &> /dev/null; then
        echo "🚀 Открываем Android Studio..."
        android-studio android
    else
        echo "💡 Откройте Android Studio вручную и загрузите папку ./android"
    fi
    
    exit 0
fi

echo "✅ Android SDK найден: $ANDROID_HOME"

# Собираем APK
echo "📱 Собираем APK..."

cd android

# Debug APK
echo "🔧 Собираем debug APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo "✅ Debug APK собран успешно!"
    echo "📁 Расположение: android/app/build/outputs/apk/debug/app-debug.apk"
    
    # Копируем APK в корень проекта
    cp app/build/outputs/apk/debug/app-debug.apk ../ai-ide-debug.apk
    echo "📋 Скопирован как: ai-ide-debug.apk"
else
    echo "❌ Ошибка сборки debug APK"
    exit 1
fi

# Release APK (если есть keystore)
if [ -f "app/release.keystore" ]; then
    echo "🔐 Собираем release APK..."
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        echo "✅ Release APK собран успешно!"
        echo "📁 Расположение: android/app/build/outputs/apk/release/app-release.apk"
        
        # Копируем APK в корень проекта
        cp app/build/outputs/apk/release/app-release.apk ../ai-ide-release.apk
        echo "📋 Скопирован как: ai-ide-release.apk"
    else
        echo "⚠️ Ошибка сборки release APK"
    fi
else
    echo "💡 Для release APK создайте keystore:"
    echo "   keytool -genkey -v -keystore app/release.keystore -alias ai-ide -keyalg RSA -keysize 2048 -validity 10000"
fi

cd ..

echo ""
echo "🎉 Сборка завершена!"
echo ""
echo "📱 Файлы APK:"
if [ -f "ai-ide-debug.apk" ]; then
    echo "   🔧 Debug: ai-ide-debug.apk"
fi
if [ -f "ai-ide-release.apk" ]; then
    echo "   🚀 Release: ai-ide-release.apk"
fi
echo ""
echo "📖 Для установки на устройство:"
echo "   adb install ai-ide-debug.apk"
echo ""
echo "🌐 Для веб-версии:"
echo "   npm run dev"
echo ""
echo "✨ AI IDE готова к использованию!"