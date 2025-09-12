# Бухгалтерия на Vue 3 / Vue3 Accountant Assistant
Generated with Kilo Code + Qwen3 Next 80b A3b Instruct

## English

A modern double-entry accounting application built with Vue 3 and Vite. Features include:

- Login system with admin:admin credentials
- Dashboard with account balances overview
- Transaction management with debit/credit entries
- Accounts and counterparties management
- Chess-style reconciliation report
- Data stored in localStorage (ready for Spring Boot backend integration)

All components are responsive and follow modern UI/UX best practices.

## Русский

Современное приложение для двойной бухгалтерии, построенное на Vue 3 и Vite. Возможности:

- Система входа с учетными данными admin:admin
- Дашборд с обзором остатков по счетам
- Управление проводками с дебетом и кредитом
- Управление счетами и контрагентами
- Шахматная ведомость для сверки
- Данные хранятся в localStorage (готово к интеграции с бэкендом на Spring Boot)

Все компоненты адаптивны и соответствуют современным принципам UI/UX.

## Запуск приложения

### English

After cloning the repository:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to: http://localhost:5173

4. Log in with the following credentials:
   - Username: admin
   - Password: admin

The application is ready to use. All data is stored in the browser's localStorage.

### Русский

После клонирования репозитория:

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Запустите разработческий сервер:
   ```bash
   npm run dev
   ```

3. Откройте браузер и перейдите по адресу: http://localhost:5173

4. Войдите с учетными данными:
   - Логин: admin
   - Пароль: admin

Приложение готово к использованию. Все данные сохраняются в localStorage браузера.

## Сборка APK для Android

### English

To build an APK file for installation on an Android device:

1. Make sure you have the Android SDK installed and configured in `android/local.properties` (path: `sdk.dir=D:/App/Android/SDK`).
2. Build the web version of the application:
   ```bash
   npm run build
   ```
3. Add the Android platform (if not already added):
   ```bash
   npx cap add android
   ```
4. Copy the built web assets into the Android project:
   ```bash
   npx cap copy
   ```
5. Build the debug APK:
   ```bash
   cd android && ./gradlew assembleDebug
   ```
6. The APK file will be generated at:  
   `android/app/build/outputs/apk/debug/app-debug.apk`

Copy this file to your device and install it manually (enable "Install from unknown sources").

### Русский

Чтобы собрать APK-файл для установки на Android-устройство:

1. Убедитесь, что у вас установлен Android SDK и он настроен в файле `android/local.properties` (путь: `sdk.dir=D:/App/Android/SDK`).
2. Соберите веб-версию приложения:
   ```bash
   npm run build
   ```
3. Добавьте платформу Android (если ещё не добавлена):
   ```bash
   npx cap add android
   ```
4. Скопируйте собранный код в Android-проект:
   ```bash
   npx cap copy
   ```
5. Соберите отладочный APK:
   ```bash
   cd android && ./gradlew assembleDebug
   ```
6. APK-файл будет сгенерирован по пути:  
   `android/app/build/outputs/apk/debug/app-debug.apk`

Скопируйте этот файл на устройство и установите вручную (включив "Установка из неизвестных источников").
