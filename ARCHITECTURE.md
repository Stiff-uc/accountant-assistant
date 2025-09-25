# Архитектура бухгалтерского приложения на Vue 3

## Overview
The application is a double-entry accounting system (debit-credit) with minimal functionality: transactions and balance viewing. Data is stored in localStorage with the possibility of future migration to Spring Boot.

The application includes:
- Account management with predefined account sets
- Transaction recording with double-entry bookkeeping
- Counterparty management
- Chess report for account analysis
- Mobile support through Capacitor
- Initial setup wizard for account configuration

## Структура проекта

```
src/
├── assets/                 # Static resources (images, styles)
├── components/             # Reusable components
│   ├── common/             # Common components
│   │   └── Navigation.vue  # Navigation menu
│   └── HelloWorld.vue      # Example Vue component
├── views/                  # Application pages
│   ├── Login.vue           # Login page
│   ├── Dashboard.vue       # Dashboard with balances
│   ├── Transactions.vue    # Transactions page
│   ├── Accounts.vue        # Accounts page
│   ├── Counterparties.vue  # Counterparties page
│   ├── ChessReport.vue     # Chess report
│   └── Wizard.vue          # Account setup wizard
├── stores/                 # Pinia state stores
│   ├── authStore.js        # Authentication store
│   ├── accountsStore.js    # Accounts store
│   ├── transactionsStore.js # Transactions store
│   └── counterpartiesStore.js # Counterparties store
├── services/               # Data services
│   ├── dataService.js      # Abstract data service
│   ├── localStorageService.js # localStorage implementation
│   ├── dataServiceInstance.js # Singleton instance of data service
│   └── apiService.js       # Spring Boot API stub
├── models/                 # Data models
│   ├── Account.js          # Account model
│   ├── Transaction.js      # Transaction model
│   └── Counterparty.js     # Counterparty model
├── utils/                  # Utilities
│   └── constants.js        # Application constants
├── router/                 # Routing configuration
│   └── index.js            # Vue Router configuration
├── App.vue                 # Root component
├── main.js                 # Entry point
└── style.css               # Global application styles
```

### Mobile Support

The project includes mobile device support through Capacitor:

```
android/                     # Android project for mobile version
├── app/                     # Main module of Android application
├── build.gradle             # Build configuration
├── gradle.properties        # Gradle properties
└── ...                      # Other Android project files

capacitor.config.json        # Capacitor configuration
```

## Components

### HelloWorld.vue
Example Vue component that demonstrates basic Vue functionality with reactive state management. This component is included as a template for developers and can be removed in production.

### Wizard.vue
Account setup wizard that allows users to select predefined account sets during initial application setup. The wizard provides two options:
- **Default Account Set**: Standard business accounts for general accounting
- **School Budget Account Set**: Specialized accounts for school budget management

The wizard is displayed automatically on first login when no accounts exist in the system.

## Data Models

### Account
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

### Transaction
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

### Counterparty
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

## Data Abstraction Layer

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
  async isAuthenticated() {}
}
```

### LocalStorageService (localStorage implementation)
Implementation of all DataService methods using localStorage for data storage.

### dataServiceInstance.js (Singleton pattern)
Singleton instance that provides a single point of access to the data service implementation:
```javascript
import { LocalStorageService } from './localStorageService'

// Singleton instance of the data service implementation
const dataService = new LocalStorageService()

export default dataService
```
This pattern ensures that all components and stores use the same instance of the data service, maintaining consistency across the application.

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
- `/wizard` - Account setup wizard for initial configuration

### Routing Logic

The application uses an intelligent routing system:

1. On first login, the user is redirected to the `/wizard` page to select an account set
2. After selecting accounts in the wizard, the user is redirected to `/dashboard`
3. On subsequent logins, the user goes directly to `/dashboard`
4. All routes except `/login` and `/wizard` are protected by authentication

## Predefined Chart of Accounts

The application provides two predefined account sets that can be selected during initial setup:

### Default Account Set

#### Assets
- 10 "Cash"
- 41 "Bank account"
- 43 "Inventory"

#### Liabilities
- 60 "Accounts payable"
- 70 "Payroll"

#### Income
- 90 "Sales"

#### Expenses
- 20 "Purchases"
- 44 "Other expenses"

### School Budget Account Set

#### Assets
- 300 "General cash"

#### Income
- 100 "Parent contributions"
- 101 "Donations"

#### Expenses
- 200 "Educational materials"
- 201 "Cultural events"
- 202 "Birthdays and celebrations"
- 203 "Transport and trips"
- 204 "Other expenses"

## Security

- Simple authentication with predefined credentials (admin:admin)
- Route protection using Vue Router navigation guards
- Data stored in localStorage (will be replaced with server storage in future)
- The `isAuthenticated` state is managed by `authStore` and is derived from the presence of a valid user session. It is **not** a method of `DataService`, because authentication state is a UI concern, not a data operation. `DataService` provides `login`, `logout`, and `getCurrentUser` — but the boolean flag `isAuthenticated` is maintained by `authStore` to avoid coupling state management with data service logic.

## Global Styles

The application uses `src/style.css` for global styling with the following features:
- CSS custom properties for consistent theming
- Dark/light mode support with `prefers-color-scheme`
- Responsive typography and spacing
- Consistent button and link styling
- Mobile-first approach with responsive breakpoints

## Dependencies and Technologies

### Core Dependencies
- **Vue 3** (v3.5.18): Progressive JavaScript framework for building user interfaces
- **Vue Router** (v4.5.1): Official routing library for Vue.js
- **Pinia** (v3.0.3): Intuitive, type safe, light and flexible Store for Vue
- **Vite** (v7.1.5): Next generation frontend tooling
- **UUID** (v13.0.0): Generate RFC-compliant UUIDs

### Mobile Support
- **Capacitor** (v7.4.3): Cross-platform native runtime for web apps
  - @capacitor/android: Android runtime
  - @capacitor/core: Core Capacitor APIs
  - @capacitor/cli: Command-line interface

### Development Dependencies
- **TypeScript** (v5.9.2): Typed JavaScript at any scale
- **@vitejs/plugin-vue** (v6.0.1): Official Vue plugin for Vite

## Responsiveness

- Utilizes CSS Grid and Flexbox for responsive design
- Mobile-first development approach
- Adaptive layout switching based on screen width:
  - **Mobile & Tablet (≤ 899px)**: Card-based UI for better touch interaction and vertical scrolling
  - **Desktop (≥ 900px)**: Traditional table-based UI for efficient data comparison and bulk operations
- Media queries enforce the transition between UI modes at 900px breakpoint
- All three data views (Transactions, Accounts, Counterparties) follow the same responsive pattern
- Table layout uses `table-layout: fixed` to ensure consistent column width distribution across devices