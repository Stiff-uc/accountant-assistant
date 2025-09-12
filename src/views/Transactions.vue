<template>
  <div class="transactions-container">
    <h1>Проводки</h1>

    <!-- Фильтры -->
    <div class="filters">
      <div class="filter-group">
        <label for="date-from">Дата с</label>
        <input
          id="date-from"
          v-model="filters.dateFrom"
          type="date"
        />
      </div>

      <div class="filter-group">
        <label for="date-to">Дата по</label>
        <input
          id="date-to"
          v-model="filters.dateTo"
          type="date"
        />
      </div>

      <div class="filter-group">
        <label for="account-filter">Счёт</label>
        <select id="account-filter" v-model="filters.accountId">
          <option value="">Все счета</option>
          <option 
            v-for="account in accountsStore.accounts" 
            :key="account.id"
            :value="account.id"
          >
            {{ account.code }} - {{ account.name }}
          </option>
        </select>
      </div>

      <button @click="applyFilters" class="filter-button">
        Применить
      </button>
      <button @click="resetFilters" class="reset-button">
        Сбросить
      </button>
    </div>

    <!-- Кнопка добавления -->
    <div class="actions">
      <button @click="openTransactionForm" class="add-button">
        Добавить проводку
      </button>
    </div>

    <!-- Таблица проводок -->
    <div class="transactions-table">
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Описание</th>
            <th>Дебет</th>
            <th>Кредит</th>
            <th>Сумма</th>
            <th>Контрагент</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="transaction in filteredTransactions" 
            :key="transaction.id"
          >
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ getAccountName(transaction.debitAccountId) }}</td>
            <td>{{ getAccountName(transaction.creditAccountId) }}</td>
            <td class="amount">{{ formatCurrency(transaction.amount) }}</td>
            <td>{{ getCounterpartyName(transaction.counterpartyId) }}</td>
            <td class="actions">
              <button @click="editTransaction(transaction)" class="edit-button">
                Редактировать
              </button>
              <button @click="deleteTransaction(transaction)" class="delete-button">
                Удалить
              </button>
            </td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="7" class="no-data">
              Нет проводок
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Форма добавления/редактирования -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-card">
        <h2>{{ editingTransaction ? 'Редактировать проводку' : 'Добавить проводку' }}</h2>
        
        <form @submit.prevent="saveTransaction">
          <div class="form-group">
            <label for="transaction-date">Дата</label>
            <input
              id="transaction-date"
              v-model="form.date"
              type="date"
              required
            />
          </div>

          <div class="form-group">
            <label for="transaction-description">Описание</label>
            <input
              id="transaction-description"
              v-model="form.description"
              type="text"
              placeholder="Введите описание"
            />
          </div>

          <div class="form-group">
            <label for="debit-account">Дебетный счёт</label>
            <select
              id="debit-account"
              v-model="form.debitAccountId"
              required
            >
              <option value="">Выберите счёт</option>
              <option 
                v-for="account in accountsStore.accounts" 
                :key="account.id"
                :value="account.id"
              >
                {{ account.code }} - {{ account.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="credit-account">Кредитный счёт</label>
            <select
              id="credit-account"
              v-model="form.creditAccountId"
              required
            >
              <option value="">Выберите счёт</option>
              <option 
                v-for="account in accountsStore.accounts" 
                :key="account.id"
                :value="account.id"
              >
                {{ account.code }} - {{ account.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="transaction-amount">Сумма</label>
            <input
              id="transaction-amount"
              v-model.number="form.amount"
              type="number"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div class="form-group">
            <label for="counterparty">Контрагент</label>
            <select
              id="counterparty"
              v-model="form.counterpartyId"
            >
              <option value="">Без контрагента</option>
              <option 
                v-for="counterparty in counterpartiesStore.counterparties" 
                :key="counterparty.id"
                :value="counterparty.id"
              >
                {{ counterparty.name }}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="save-button">
              Сохранить
            </button>
            <button type="button" @click="cancelForm" class="cancel-button">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAccountsStore } from '../stores/accountsStore'
import { useTransactionsStore } from '../stores/transactionsStore'
import { useCounterpartiesStore } from '../stores/counterpartiesStore'

export default {
  name: 'Transactions',
  data() {
    return {
      accountsStore: useAccountsStore(),
      transactionsStore: useTransactionsStore(),
      counterpartiesStore: useCounterpartiesStore(),
      filters: {
        dateFrom: '',
        dateTo: '',
        accountId: ''
      },
      showForm: false,
      editingTransaction: null,
      form: {
        date: new Date().toISOString().split('T')[0],
        description: '',
        debitAccountId: '',
        creditAccountId: '',
        amount: '',
        counterpartyId: ''
      }
    }
  },
  computed: {
    filteredTransactions() {
      let transactions = this.transactionsStore.transactions
      
      // Фильтр по дате
      if (this.filters.dateFrom) {
        transactions = transactions.filter(t => t.date >= this.filters.dateFrom)
      }
      if (this.filters.dateTo) {
        transactions = transactions.filter(t => t.date <= this.filters.dateTo)
      }
      
      // Фильтр по счету
      if (this.filters.accountId) {
        transactions = transactions.filter(
          t => t.debitAccountId === this.filters.accountId || 
               t.creditAccountId === this.filters.accountId
        )
      }
      
      // Сортировка по дате (новые первыми)
      return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  mounted() {
    this.accountsStore.loadAccounts()
    this.transactionsStore.loadTransactions()
    this.counterpartiesStore.loadCounterparties()
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU')
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(amount)
    },
    
    getAccountName(accountId) {
      const account = this.accountsStore.getAccountById(accountId)
      return account ? `${account.code} - ${account.name}` : 'Неизвестно'
    },
    
    getCounterpartyName(counterpartyId) {
      const counterparty = this.counterpartiesStore.getCounterpartyById(counterpartyId)
      return counterparty ? counterparty.name : ''
    },
    
    applyFilters() {
      // Фильтры уже применяются в computed свойстве
    },
    
    resetFilters() {
      this.filters = {
        dateFrom: '',
        dateTo: '',
        accountId: ''
      }
    },
    
    openTransactionForm() {
      this.editingTransaction = null
      this.form = {
        date: new Date().toISOString().split('T')[0],
        description: '',
        debitAccountId: '',
        creditAccountId: '',
        amount: '',
        counterpartyId: ''
      }
      this.showForm = true
    },
    
    editTransaction(transaction) {
      this.editingTransaction = transaction
      this.form = {
        date: transaction.date.split('T')[0],
        description: transaction.description,
        debitAccountId: transaction.debitAccountId,
        creditAccountId: transaction.creditAccountId,
        amount: transaction.amount,
        counterpartyId: transaction.counterpartyId
      }
      this.showForm = true
    },
    
    async saveTransaction() {
      // Валидация
      const transaction = {
        id: this.editingTransaction?.id || '',
        date: this.form.date,
        description: this.form.description,
        debitAccountId: this.form.debitAccountId,
        creditAccountId: this.form.creditAccountId,
        amount: this.form.amount,
        counterpartyId: this.form.counterpartyId
      }

      const errors = []

      if (!transaction.date) errors.push('Выберите дату')
      if (!transaction.debitAccountId) errors.push('Выберите дебетный счёт')
      if (!transaction.creditAccountId) errors.push('Выберите кредитный счёт')
      if (!transaction.amount || transaction.amount <= 0) errors.push('Укажите сумму больше нуля')
      if (transaction.debitAccountId === transaction.creditAccountId) errors.push('Дебетный и кредитный счёт не могут быть одинаковыми')

      if (errors.length > 0) {
        alert(errors.join('\n'))
        return
      }
      
      try {
        if (this.editingTransaction) {
          await this.transactionsStore.updateTransaction(this.editingTransaction.id, transaction)
        } else {
          await this.transactionsStore.createTransaction(transaction)
        }
        
        this.showForm = false
        this.editingTransaction = null
      } catch (error) {
        alert('Не удалось сохранить проводку')
      }
    },
    
    async deleteTransaction(transaction) {
      if (!confirm('Вы уверены, что хотите удалить эту проводку?')) return
      
      try {
        await this.transactionsStore.deleteTransaction(transaction.id)
      } catch (error) {
        alert('Не удалось удалить проводку')
      }
    },
    
    cancelForm() {
      this.showForm = false
      this.editingTransaction = null
    }
  }
}
</script>

<style scoped>
.transactions-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 70px;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.filter-group input,
.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.filter-button,
.reset-button {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1.5rem;
}

.filter-button {
  background-color: #007bff;
  color: white;
}

.filter-button:hover {
  background-color: #0056b3;
}

.reset-button {
  background-color: #6c757d;
  color: white;
}

.reset-button:hover {
  background-color: #5a6268;
}

.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.add-button {
  padding: 0.75rem 2rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #218838;
}

.transactions-table {
  margin-bottom: 2rem;
}

.transactions-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.transactions-table th,
.transactions-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.transactions-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.transactions-table tr:hover {
  background-color: #f8f9fa;
}

.amount {
  font-weight: 700;
  color: #333;
  text-align: right;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.edit-button {
  background-color: #17a2b8;
  color: white;
}

.edit-button:hover {
  background-color: #138496;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
  font-size: 1.1rem;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-card h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.save-button,
.cancel-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .transactions-container {
    padding: 1rem;
  }
  
  .filters {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-button,
  .reset-button {
    margin-top: 0;
  }
  
  .transactions-table th,
  .transactions-table td {
    padding: 0.75rem;
  }
  
  .form-card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>