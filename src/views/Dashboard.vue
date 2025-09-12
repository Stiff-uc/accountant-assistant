<template>
  <div class="dashboard-container">
    <h1>Дашборд</h1>

    <!-- Счета, отображаемые на дашборде -->
    <h2>Счета</h2>
    <div class="accounts-grid">
      <div
        class="account-card"
        v-for="account in visibleAccounts"
        :key="account.id"
        :class="['account-card', account.type]"
      >
        <div class="account-header">
          <h3 class="account-name">{{ account.name }}</h3>
        </div>
        <div class="account-balance">{{ formatCurrency(account.balance) }}</div>
      </div>
      <div v-if="visibleAccounts.length === 0" class="no-accounts">
        Нет счетов для отображения
      </div>
    </div>

    <!-- Последние проводки -->
    <div class="recent-transactions">
      <h2>Последние проводки</h2>
      <div class="transactions-list" v-if="recentTransactions.length">
        <div 
          class="transaction-item" 
          v-for="transaction in recentTransactions" 
          :key="transaction.id"
        >
          <div class="transaction-date">{{ formatDate(transaction.date) }}</div>
          <div class="transaction-description">{{ transaction.description }}</div>
          <div class="transaction-accounts">
            <span class="debit">{{ getAccountName(transaction.debitAccountId) }}</span>
            <span class="arrow">→</span>
            <span class="credit">{{ getAccountName(transaction.creditAccountId) }}</span>
          </div>
          <div class="transaction-amount">{{ formatCurrency(transaction.amount) }}</div>
        </div>
      </div>
      <div v-else class="no-transactions">
        Нет проводок
      </div>
    </div>

    <!-- Действия -->
    <div class="actions">
      <button @click="$router.push('/transactions')">
        Добавить проводку
      </button>
      <button @click="$router.push('/accounts')">
        Управление счетами
      </button>
    </div>
  </div>
</template>

<script>
import { useAccountsStore } from '../stores/accountsStore'
import { useTransactionsStore } from '../stores/transactionsStore'
import { useCounterpartiesStore } from '../stores/counterpartiesStore'

export default {
  name: 'Dashboard',
  data() {
    return {
      accountsStore: useAccountsStore(),
      transactionsStore: useTransactionsStore(),
      counterpartiesStore: useCounterpartiesStore()
    }
  },
  computed: {
    recentTransactions() {
      return this.transactionsStore.transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    },
    visibleAccounts() {
      return this.accountsStore.accounts
        .filter(account => account.isFavorite)
        .sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  mounted() {
    // Загрузка данных при входе на страницу
    this.accountsStore.loadAccounts()
    this.transactionsStore.loadTransactions()
    this.counterpartiesStore.loadCounterparties()
    console.log('Dashboard mounted, accountsStore.accounts:', this.accountsStore.accounts)
    console.log('localStorage accounts:', localStorage.getItem('buhvue_accounts'))
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(amount)
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU')
    },
    
    getAccountName(accountId) {
      const account = this.accountsStore.getAccountById(accountId)
      return account ? account.name : 'Неизвестно'
    },
    
    toggleFavorite(account) {
      const updatedAccount = {
        ...account,
        isFavorite: !account.isFavorite
      }
      this.accountsStore.updateAccount(account.id, updatedAccount)
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.accounts-grid {
  margin-bottom: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.accounts-grid h2 {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #eee;
}

.account-card {
  background-color: white;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  border-left: 4px solid #ccc;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.account-card.asset {
  border-left-color: #2196f3;
  background-color: #e3f2fd;
}

.account-card.liability {
  border-left-color: #cddc39;
  background-color: #f0f4c3;
}

.account-card.income {
  border-left-color: #4caf50;
  background-color: #e8f5e9;
}

.account-card.expense {
  border-left-color: #f44336;
  background-color: #ffebee;
}

.account-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.favorite-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease;
  color: #ccc;
}

.favorite-icon.favorite {
  color: #ffcc00;
}

.account-name {
  font-weight: 700;
  color: #333;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.account-balance {
  font-weight: 800;
  color: #222;
  font-size: 1.5rem;
  margin: 0;
  line-height: 1;
}

.no-accounts {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.summary-card {
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.summary-card h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: #555;
}

.summary-card .amount {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.summary-card.asset {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.summary-card.liability {
  background-color: #f0f4c3;
  border-left: 4px solid #cddc39;
}

.summary-card.income {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.summary-card.expense {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}

.recent-transactions {
  margin-bottom: 2.5rem;
}

.recent-transactions h2 {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #eee;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 1fr;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.transaction-date {
  font-size: 0.9rem;
  color: #666;
}

.transaction-description {
  font-size: 0.95rem;
  color: #333;
}

.transaction-accounts {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.transaction-accounts .debit {
  font-weight: 600;
  color: #d32f2f;
}

.transaction-accounts .credit {
  font-weight: 600;
  color: #2e7d32;
}

.transaction-accounts .arrow {
  margin: 0 0.5rem;
  color: #999;
}

.transaction-amount {
  font-weight: 700;
  color: #333;
  text-align: right;
}

.no-transactions {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.actions button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.actions button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .transaction-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .transaction-date,
  .transaction-description,
  .transaction-accounts,
  .transaction-amount {
    text-align: left;
  }
  
  .transaction-accounts {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .transaction-accounts .arrow {
    margin: 0.25rem 0;
  }
}

.accounts-list {
  margin-bottom: 2.5rem;
}

.accounts-list h2 {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #eee;
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.account-item.asset {
  border-left: 4px solid #2196f3;
}

.account-item.liability {
  border-left: 4px solid #cddc39;
}

.account-item.income {
  border-left: 4px solid #4caf50;
}

.account-item.expense {
  border-left: 4px solid #f44336;
}

.account-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.account-balance {
  font-weight: 700;
  color: #333;
  font-size: 1rem;
}

.no-accounts {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.summary-card {
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.summary-card h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: #555;
}

.summary-card .amount {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.summary-card.asset {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.summary-card.liability {
  background-color: #f0f4c3;
  border-left: 4px solid #cddc39;
}

.summary-card.income {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.summary-card.expense {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}

.recent-transactions {
  margin-bottom: 2.5rem;
}

.recent-transactions h2 {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #eee;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 1fr;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.transaction-date {
  font-size: 0.9rem;
  color: #666;
}

.transaction-description {
  font-size: 0.95rem;
  color: #333;
}

.transaction-accounts {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.transaction-accounts .debit {
  font-weight: 600;
  color: #d32f2f;
}

.transaction-accounts .credit {
  font-weight: 600;
  color: #2e7d32;
}

.transaction-accounts .arrow {
  margin: 0 0.5rem;
  color: #999;
}

.transaction-amount {
  font-weight: 700;
  color: #333;
  text-align: right;
}

.no-transactions {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.actions button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.actions button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .transaction-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .transaction-date,
  .transaction-description,
  .transaction-accounts,
  .transaction-amount {
    text-align: left;
  }
  
  .transaction-accounts {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .transaction-accounts .arrow {
    margin: 0.25rem 0;
  }
}
</style>