# Архитектура бухгалтерского приложения на Vue 3

## Обзор
Приложение представляет собой систему бухгалтерского учета с двойной записью (дебет-кредит) с минимальным функционалом: проводки и просмотр остатков. Данные будут храниться в localStorage с возможностью последующего перехода на Spring Boot.

## Структура проекта

```
src/
├── assets/                 # Static resources (images, styles)
├── components/             # Reusable components
│   ├── common/             # Common components
│   │   ├── LoginForm.vue   # Login form
│   │   └── Navigation.vue  # Navigation menu
├── views/                  # Application pages
│   ├── Login.vue           # Login page
│   ├── Dashboard.vue       # Dashboard with balances
│   ├── Transactions.vue    # Transactions page
│   ├── Accounts.vue        # Accounts page
│   ├── Counterparties.vue  # Counterparties page
│   └── ChessReport.vue     # Chess report
├── stores/                 # Pinia state stores
│   ├── authStore.js        # Authentication store
│   ├── accountsStore.js    # Accounts store
│   ├── transactionsStore.js # Transactions store
│   └── counterpartiesStore.js # Counterparties store
├── services/               # Data services
│   ├── dataService.js      # Abstract data service
│   ├── localStorageService.js # localStorage implementation
│   └── apiService.js       # Spring Boot API stub
├── models/                 # Data models
│   ├── Account.js          # Account model
│   ├── Transaction.js      # Transaction model
│   └── Counterparty.js     # Counterparty model
├── utils/                  # Utilities
│   ├── validation.js       # Validation functions
│   ├── formatters.js       # Data formatting
│   └── constants.js        # Application constants
├── router/                 # Routing configuration
│   └── index.js            # Vue Router configuration
├── App.vue                 # Root component
└── main.js                 # Entry point
```

## Модели данных

### Account (Счет)
```javascript
{
  id: string,               // Unique identifier
  code: string,             // Account code (e.g., "10", "20", "41", "51")
  name: string,             // Account name
  type: string,             // Type: "asset", "liability", "income", "expense"
  isActive: boolean,        // Account active status
  balance: number,          // Current balance
  isFavorite: boolean,      // Favorite account
  createdAt: Date,          // Creation date
  updatedAt: Date           // Update date
}
```

### Transaction (Проводка)
```javascript
{
  id: string,               // Unique identifier
  date: Date,               // Transaction date
  description: string,      // Transaction description
  debitAccountId: string,   // Debit account ID
  creditAccountId: string,  // Credit account ID
  amount: number,           // Amount
  counterpartyId: string,   // Counterparty ID (optional)
  createdAt: Date,          // Creation date
  updatedAt: Date           // Update date
}
```

### Counterparty (Контрагент)
```javascript
{
  id: string,               // Unique identifier
  name: string,             // Counterparty name
  inn: string,              // INN (optional)
  address: string,          // Address (optional)
  phone: string,            // Phone (optional)
  email: string,            // Email (optional)
  createdAt: Date,          // Creation date
  updatedAt: Date           // Update date
}
```

## Слой абстракции данных

### DataService (Abstract class)
```javascript
class DataService {
  // Account methods
  async getAccounts() {}
  async getAccountById(id) {}
  async createAccount(account) {}
  async updateAccount(id, account) {}
  async deleteAccount(id) {}
    
  // Transaction methods
  async getTransactions(filters = {}) {}
  async getTransactionById(id) {}
  async createTransaction(transaction) {}
  async updateTransaction(id, transaction) {}
  async deleteTransaction(id) {}
    
  // Counterparty methods
  async getCounterparties() {}
  async getCounterpartyById(id) {}
  async createCounterparty(counterparty) {}
  async updateCounterparty(id, counterparty) {}
  async deleteCounterparty(id) {}
    
  // Authentication methods
  async login(username, password) {}
  async logout() {}
  async getCurrentUser() {}
}
```

### LocalStorageService (localStorage implementation)
Implementation of all DataService methods using localStorage for data storage.

### ApiService (Spring Boot stub)
Stub methods for future interaction with Spring Boot API.

## State Stores (Pinia)

### authStore
Authentication state management:
- Current user
- Login status
- Token (in future)

### accountsStore
Accounts management:
- List of accounts
- Currently selected account
- CRUD operations

### transactionsStore
Transactions management:
- List of transactions
- Filters
- CRUD operations

### counterpartiesStore
Counterparties management:
- List of counterparties
- Currently selected counterparty
- CRUD operations

## Routing

- `/login` - Login page
- `/dashboard` - Dashboard with account balances
- `/transactions` - Transactions page
- `/accounts` - Accounts page
- `/counterparties` - Counterparties page
- `/chess-report` - Chess report

## Predefined Chart of Accounts

### Assets
- 10 "Cash"
- 41 "Bank account"
- 43 "Inventory"

### Liabilities
- 60 "Accounts payable"
- 70 "Payroll"

### Income
- 90 "Sales"

### Expenses
- 20 "Purchases"
- 44 "Other expenses"

## Security

- Simple authentication with predefined credentials (admin:admin)
- Route protection using Vue Router navigation guards
- Data stored in localStorage (will be replaced with server storage in future)

## Адаптивность

- Использование CSS Grid и Flexbox для адаптивного дизайна
- Мобильная-first разработка
- Поддержка различных размеров экранов