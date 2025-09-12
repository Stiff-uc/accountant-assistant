# Диаграмма архитектуры бухгалтерского приложения

## Обновлено: 12 сентября 2025

## Общая архитектура приложения

```mermaid
graph TB
    subgraph "Пользовательский интерфейс (Vue 3)"
        A[Login.vue] --> B[App.vue]
        C[Dashboard.vue] --> B
        D[Transactions.vue] --> B
        E[Accounts.vue] --> B
        F[Counterparties.vue] --> B
        G[ChessReport.vue] --> B
        
        subgraph "Общие компоненты"
            H[LoginForm.vue]
            I[Navigation.vue]
        end
    end
    
    subgraph "Управление состоянием (Pinia)"
        N[authStore]
        O[accountsStore]
        P[transactionsStore]
        Q[counterpartiesStore]
    end
    
    subgraph "Сервисы данных"
        R[DataService]
        S[LocalStorageService]
        T[ApiService<br/>(для будущего Spring Boot)]
    end
    
    subgraph "Модели данных"
        U[Account]
        V[Transaction]
        W[Counterparty]
    end
    
    subgraph "Хранилище"
        X[LocalStorage<br/>(текущее решение)]
        Y[Spring Boot API<br/>(будущее решение)]
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
    
    %% Обновленные связи для компонентов
    B --> H
    B --> I
```

## Поток данных при создании проводки

```mermaid
sequenceDiagram
    participant U as Пользователь
    participant C as Transactions.vue
    participant S as transactionsStore
    participant DS as LocalStorageService
    participant AS as accountsStore
    participant CS as counterpartiesStore
    
    U->>C: Заполняет форму проводки
    C->>S: createTransaction(transactionData)
    S->>DS: createTransaction(transactionData)
    DS->>DS: Сохраняет проводку в localStorage
    DS->>AS: Обновляет остатки по счетам
    DS->>CS: Обновляет данные контрагента (если указан)
    DS-->>S: Возвращает созданную проводку
    S-->>C: Обновляет список проводок
    C-->>U: Отображает результат
```

## Структура навигации и защиты маршрутов

```mermaid
graph TD
    A[Начало] --> B{Пользователь авторизован?}
    B -->|Да| C[Показать навигацию и дашборд]
    B -->|Нет| D[Перенаправить на страницу входа]
    
    C --> E[Dashboard.vue]
    C --> F[Transactions.vue]
    C --> G[Accounts.vue]
    C --> H[Counterparties.vue]
    C --> I[ChessReport.vue]
    
    D --> J[Login.vue]
    J --> K{Успешная аутентификация?}
    K -->|Да| C
    K -->|Нет| J
```

## Слой абстракции данных

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

## Модели данных

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