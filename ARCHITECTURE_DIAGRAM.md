# Architecture Diagram of the Accounting Application

## Updated: September 25, 2025

## Overall Application Architecture

```mermaid
graph TB
    subgraph "User Interface (Vue 3)"
        A[Login.vue] --> B[App.vue]
        C[Dashboard.vue] --> B
        D[Transactions.vue] --> B
        E[Accounts.vue] --> B
        F[Counterparties.vue] --> B
        G[ChessReport.vue] --> B
        W[Wizard.vue] --> B
        
        subgraph "Common Components"
            H[HelloWorld.vue]
            I[Navigation.vue]
        end
    end
    
    subgraph "State Management (Pinia)"
        N[authStore]
        O[accountsStore]
        P[transactionsStore]
        Q[counterpartiesStore]
    end
    
    subgraph "Data Services"
        R[DataService]
        S[LocalStorageService]
        T["ApiService (for future Spring Boot)"]
    end
    
    subgraph "Data Models"
        U[Account]
        V[Transaction]
        W[Counterparty]
    end
    
    subgraph "Storage"
        X["LocalStorage<br/>(current solution)"]
        Y["Spring Boot API<br/>(future solution)"]
    end
    
    B --> N
    B --> O
    B --> P
    B --> Q
    
    N --> R
    O --> R
    P --> R
    Q --> R
    
    R --> S
    R --> T
    
    S --> X
    T --> Y
    
    R --> U
    R --> V
    R --> W
    
    %% Updated connections for components
    B --> H
    B --> I
```

## Data Flow During Transaction Creation

```mermaid
sequenceDiagram
    participant U as User
    participant C as Transactions.vue
    participant S as transactionsStore
    participant DS as LocalStorageService
    participant AS as accountsStore
    participant CS as counterpartiesStore
    
    U->>C: Fills out transaction form
    C->>S: createTransaction(transactionData)
    S->>DS: createTransaction(transactionData)
    DS->>DS: Saves transaction to localStorage
    DS->>AS: Updates account balances
    DS->>CS: Updates counterparty data (if specified)
    DS-->>S: Returns created transaction
    S-->>C: Updates transaction list
    C-->>U: Displays result
```

## Navigation Structure and Route Protection

```mermaid
graph TD
    A[Start] --> B{Is user authenticated?}
    B -->|No| D[Redirect to login page]
    B -->|Yes| C{Accounts exist?}
    C -->|No| W[Show Wizard]
    C -->|Yes| E[Show navigation and dashboard]
    
    E --> F[Dashboard.vue]
    E --> G[Transactions.vue]
    E --> H[Accounts.vue]
    E --> I[Counterparties.vue]
    E --> J[ChessReport.vue]
    
    D --> K[Login.vue]
    K --> L{Successful authentication?}
    L -->|No| K
    L -->|Yes| C
    
    W --> M[Wizard.vue]
    M --> N{Account set selected?}
    N -->|Yes| E
    N -->|No| M
```

## Data Abstraction Layer

```mermaid
classDiagram
    class DataService {
        <<abstract>>
        +getAccounts()
        +getAccountById(id)
        +createAccount(account)
        +updateAccount(id, account)
        +deleteAccount(id)
        +getTransactions(filters)
        +getTransactionById(id)
        +createTransaction(transaction)
        +updateTransaction(id, transaction)
        +deleteTransaction(id)
        +getCounterparties()
        +getCounterpartyById(id)
        +createCounterparty(counterparty)
        +updateCounterparty(id, counterparty)
        +deleteCounterparty(id)
        +login(username, password)
        +logout()
        +getCurrentUser()
    }
    
    class LocalStorageService {
        +getAccounts()
        +getAccountById(id)
        +createAccount(account)
        +updateAccount(id, account)
        +deleteAccount(id)
        +getTransactions(filters)
        +getTransactionById(id)
        +createTransaction(transaction)
        +updateTransaction(id, transaction)
        +deleteTransaction(id)
        +getCounterparties()
        +getCounterpartyById(id)
        +createCounterparty(counterparty)
        +updateCounterparty(id, counterparty)
        +deleteCounterparty(id)
        +login(username, password)
        +logout()
        +getCurrentUser()
    }
    
    class ApiService {
        +getAccounts()
        +getAccountById(id)
        +createAccount(account)
        +updateAccount(id, account)
        +deleteAccount(id)
        +getTransactions(filters)
        +getTransactionById(id)
        +createTransaction(transaction)
        +updateTransaction(id, transaction)
        +deleteTransaction(id)
        +getCounterparties()
        +getCounterpartyById(id)
        +createCounterparty(counterparty)
        +updateCounterparty(id, counterparty)
        +deleteCounterparty(id)
        +login(username, password)
        +logout()
        +getCurrentUser()
    }
    
    DataService <|-- LocalStorageService
    DataService <|-- ApiService
```

## Data Models

```mermaid
classDiagram
    class Account {
        +String id
        +String code
        +String name
        +String type
        +Boolean isActive
        +Number balance
        +Boolean isFavorite
        +Date createdAt
        +Date updatedAt
    }
    
    class Transaction {
        +String id
        +Date date
        +String description
        +String debitAccountId
        +String creditAccountId
        +Number amount
        +String counterpartyId
        +Date createdAt
        +Date updatedAt
    }
    
    class Counterparty {
        +String id
        +String name
        +String inn
        +String address
        +String phone
        +String email
        +Date createdAt
        +Date updatedAt
    }
    
    Transaction "1" -- "1" Account : debitAccountId
    Transaction "1" -- "1" Account : creditAccountId
    Transaction "0..1" -- "1" Counterparty : counterpartyId