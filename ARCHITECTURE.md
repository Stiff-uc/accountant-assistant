# Архитектура бухгалтерского приложения на Vue 3

## Обзор
Приложение представляет собой систему бухгалтерского учета с двойной записью (дебет-кредит) с минимальным функционалом: проводки и просмотр остатков. Данные будут храниться в localStorage с возможностью последующего перехода на Spring Boot.

## Структура проекта

```
src/
├── assets/                 # Статические ресурсы (изображения, стили)
├── components/             # Переиспользуемые компоненты
│   ├── common/             # Общие компоненты
│   │   ├── LoginForm.vue   # Форма входа
│   │   ├── Navigation.vue  # Навигационное меню
│   │   └── DataTable.vue   # Таблица для отображения данных
│   ├── accounts/           # Компоненты для работы со счетами
│   ├── transactions/       # Компоненты для работы с проводками
│   └── counterparties/     # Компоненты для работы с контрагентами
├── views/                  # Страницы приложения
│   ├── Login.vue           # Страница входа
│   ├── Dashboard.vue       # Дашборд с остатками
│   ├── Transactions.vue    # Страница проводок
│   ├── Accounts.vue        # Страница счетов
│   ├── Counterparties.vue  # Страница контрагентов
│   └── ChessReport.vue     # Шахматная ведомость
├── stores/                 # Pinia хранилища состояния
│   ├── authStore.js        # Хранилище аутентификации
│   ├── accountsStore.js    # Хранилище счетов
│   ├── transactionsStore.js # Хранилище проводок
│   └── counterpartiesStore.js # Хранилище контрагентов
├── services/               # Сервисы для работы с данными
│   ├── dataService.js      # Абстрактный сервис данных
│   ├── localStorageService.js # Реализация для localStorage
│   └── apiService.js       # Заготовка для Spring Boot API
├── models/                 # Модели данных
│   ├── Account.js          # Модель счета
│   ├── Transaction.js      # Модель проводки
│   └── Counterparty.js     # Модель контрагента
├── utils/                  # Утилиты
│   ├── validation.js       # Функции валидации
│   ├── formatters.js       # Форматирование данных
│   └── constants.js        # Константы приложения
├── router/                 # Настройки маршрутизации
│   └── index.js            # Конфигурация Vue Router
├── App.vue                 # Корневой компонент
└── main.js                 # Точка входа
```

## Модели данных

### Account (Счет)
```javascript
{
  id: string,               // Уникальный идентификатор
  code: string,             // Код счета (например, "10", "20", "41", "51")
  name: string,             // Наименование счета
  type: string,             // Тип: "asset", "liability", "income", "expense"
  isActive: boolean,        // Активность счета
  balance: number           // Текущий остаток
}
```

### Transaction (Проводка)
```javascript
{
  id: string,               // Уникальный идентификатор
  date: Date,               // Дата проводки
  description: string,      // Описание проводки
  debitAccountId: string,   // ID счета дебета
  creditAccountId: string,  // ID счета кредита
  amount: number,           // Сумма
  counterpartyId: string,   // ID контрагента (опционально)
  createdAt: Date,          // Дата создания
  updatedAt: Date           // Дата обновления
}
```

### Counterparty (Контрагент)
```javascript
{
  id: string,               // Уникальный идентификатор
  name: string,             // Наименование контрагента
  inn: string,              // ИНН (опционально)
  address: string,          // Адрес (опционально)
  phone: string,            // Телефон (опционально)
  email: string,            // Email (опционально)
  createdAt: Date,          // Дата создания
  updatedAt: Date           // Дата обновления
}
```

## Слой абстракции данных

### DataService (Абстрактный класс)
```javascript
class DataService {
  // Методы для работы со счетами
  async getAccounts() {}
  async getAccountById(id) {}
  async createAccount(account) {}
  async updateAccount(id, account) {}
  async deleteAccount(id) {}
  
  // Методы для работы с проводками
  async getTransactions(filters = {}) {}
  async getTransactionById(id) {}
  async createTransaction(transaction) {}
  async updateTransaction(id, transaction) {}
  async deleteTransaction(id) {}
  
  // Методы для работы с контрагентами
  async getCounterparties() {}
  async getCounterpartyById(id) {}
  async createCounterparty(counterparty) {}
  async updateCounterparty(id, counterparty) {}
  async deleteCounterparty(id) {}
  
  // Методы для аутентификации
  async login(username, password) {}
  async logout() {}
  async getCurrentUser() {}
}
```

### LocalStorageService (Реализация для localStorage)
Реализация всех методов DataService с использованием localStorage для хранения данных.

### ApiService (Заготовка для Spring Boot)
Заготовка методов для будущего взаимодействия с Spring Boot API.

## Хранилища состояния (Pinia)

### authStore
Управление состоянием аутентификации:
- Текущий пользователь
- Статус входа
- Токен (в будущем)

### accountsStore
Управление счетами:
- Список счетов
- Текущий выбранный счет
- Методы для CRUD операций

### transactionsStore
Управление проводками:
- Список проводок
- Фильтры
- Методы для CRUD операций

### counterpartiesStore
Управление контрагентами:
- Список контрагентов
- Текущий выбранный контрагент
- Методы для CRUD операций

## Маршрутизация

- `/login` - Страница входа
- `/dashboard` - Дашборд с остатками по счетам
- `/transactions` - Страница проводок
- `/accounts` - Страница счетов
- `/counterparties` - Страница контрагентов
- `/chess-report` - Шахматная ведомость

## Предустановленный план счетов

### Активы
- 10 "Касса"
- 41 "Расчетный счет"
- 43 "Товары на складе"

### Пассивы
- 60 "Расчеты с поставщиками"
- 70 "Расчеты с персоналом"

### Доходы
- 90 "Продажи"

### Расходы
- 20 "Закупки"
- 44 "Прочие расходы"

## Безопасность

- Простая аутентификация с предустановленными данными (admin:admin)
- Защита маршрутов с использованием навигационных охранников Vue Router
- Хранение данных в localStorage (в будущем будет заменено на серверное хранилище)

## Адаптивность

- Использование CSS Grid и Flexbox для адаптивного дизайна
- Мобильная-first разработка
- Поддержка различных размеров экранов