<template>
  <div class="accounts-container">
    <h1>Счета</h1>

    <!-- Действия -->
    <div class="actions">
      <button @click="openAccountForm" class="add-button">
        Добавить счёт
      </button>
    </div>

    <!-- Таблица счетов -->
    <div class="accounts-table">
      <table>
        <thead>
          <tr>
            <th>Код</th>
            <th>Название</th>
            <th>Тип</th>
            <th>Баланс</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="account in accountsStore.accounts.sort((a, b) => a.code.localeCompare(b.code))"
            :key="account.id"
            :class="{ 'inactive-account': !account.isActive }"
          >
            <td>{{ account.code }}</td>
            <td>
              <span
                class="favorite-icon"
                :class="{ 'favorite': account.isFavorite }"
                @click="toggleFavorite(account)"
              >
                {{ account.isFavorite ? '⭐' : '☆' }}
              </span>
              {{ account.name }}
            </td>
            <td>{{ accountTypeLabel(account.type) }}</td>
            <td class="amount">{{ formatCurrency(account.balance) }}</td>
            <td>
              <span 
                class="status-badge" 
                :class="{ 'active': account.isActive, 'inactive': !account.isActive }"
              >
                {{ account.isActive ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td class="actions">
              <button @click="editAccount(account)" class="edit-button">
                Редактировать
              </button>
              <button @click="deleteAccount(account)" class="delete-button">
                Удалить
              </button>
            </td>
          </tr>
          <tr v-if="accountsStore.accounts.length === 0">
            <td colspan="6" class="no-data">
              Нет счетов
            </td>
          </tr>
        </tbody>
      </table>
    </div>
   
    <button @click="recalculateBalances" class="recalculate-button">
      Пересчитать балансы по проводкам
    </button>

    <!-- Форма добавления/редактирования -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-card">
        <h2>{{ editingAccount ? 'Редактировать счёт' : 'Добавить счёт' }}</h2>
        
        <form @submit.prevent="saveAccount">
          <div class="form-group">
            <label for="account-code">Код</label>
            <input
              id="account-code"
              v-model="form.code"
              type="text"
              required
              placeholder="Введите код"
            />
          </div>

          <div class="form-group">
            <label for="account-name">Название</label>
            <input
              id="account-name"
              v-model="form.name"
              type="text"
              required
              placeholder="Введите название"
            />
          </div>

          <div class="form-group">
            <label for="account-type">Тип</label>
            <select
              id="account-type"
              v-model="form.type"
              required
            >
              <option value="">Выберите тип</option>
              <option value="asset">Актив</option>
              <option value="liability">Обязательство</option>
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
          </div>

          <div class="form-group">
            <label for="account-balance">Баланс</label>
            <input
              id="account-balance"
              v-model.number="form.balance"
              type="number"
              min="0"
              step="0.01"
            />
          </div>

          <div class="form-group">
            <label for="account-status">Статус</label>
            <select
              id="account-status"
              v-model="form.isActive"
            >
              <option value="true">Активен</option>
              <option value="false">Неактивен</option>
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
import { Account } from '../models/Account'

export default {
  name: 'Accounts',
  data() {
    return {
      accountsStore: useAccountsStore(),
      showForm: false,
      editingAccount: null,
      form: {
        code: '',
        name: '',
        type: '',
        balance: 0,
        isActive: true
      }
    }
  },
  mounted() {
    this.accountsStore.loadAccounts()
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(amount)
    },
    
    accountTypeLabel(type) {
      const labels = {
        asset: 'Актив',
        liability: 'Обязательство',
        income: 'Доход',
        expense: 'Расход'
      }
      return labels[type] || type
    },
    
    openAccountForm() {
      this.editingAccount = null
      this.form = {
        code: '',
        name: '',
        type: '',
        balance: 0,
        isActive: true
      }
      this.showForm = true
    },
    
    editAccount(account) {
      this.editingAccount = account
      this.form = {
        code: account.code,
        name: account.name,
        type: account.type,
        balance: account.balance,
        isActive: account.isActive
      }
      this.showForm = true
    },
    
    async saveAccount() {
      // Валидация
      const account = {
        id: this.editingAccount?.id || '',
        code: this.form.code,
        name: this.form.name,
        type: this.form.type,
        balance: this.form.balance,
        isActive: this.form.isActive
      }
      
      const accountModel = new Account(account)
      const { isValid, errors } = accountModel.validate()
      if (!isValid) {
        alert('Пожалуйста, исправьте ошибки в форме')
        return
      }
      
      try {
        if (this.editingAccount) {
          await this.accountsStore.updateAccount(this.editingAccount.id, account)
        } else {
          await this.accountsStore.createAccount(account)
        }
        
        this.showForm = false
        this.editingAccount = null
      } catch (error) {
        alert('Не удалось сохранить счёт')
      }
    },
    
    async deleteAccount(account) {
      if (!confirm('Вы уверены, что хотите удалить этот счёт?')) return
      
      try {
        await this.accountsStore.deleteAccount(account.id)
      } catch (error) {
        alert('Не удалось удалить счёт')
      }
    },
    
    cancelForm() {
      this.showForm = false
      this.editingAccount = null
    },

    async recalculateBalances() {
      console.log('this.transactionsStore:', this.transactionsStore)
      const accounts = this.accountsStore.accounts
      const transactionsStore = useTransactionsStore()
      const transactions = transactionsStore.transactions

      // Создаём карту балансов по ID
      const balanceMap = {}

      // Инициализируем все счета нулём
      accounts.forEach(account => {
        balanceMap[account.id] = 0
      })

      // Проходим по всем проводкам
      transactions.forEach(transaction => {
        // Дебет — уменьшает баланс
        if (balanceMap[transaction.debitAccountId] !== undefined) {
          balanceMap[transaction.debitAccountId] -= transaction.amount
        }
        // Кредит — увеличивает баланс
        if (balanceMap[transaction.creditAccountId] !== undefined) {
          balanceMap[transaction.creditAccountId] += transaction.amount
        }
      })

      // Обновляем каждый счёт
      for (const account of accounts) {
        const updatedAccount = {
          ...account,
          balance: balanceMap[account.id]
        }
        await this.accountsStore.updateAccount(account.id, updatedAccount)
      }

      // Перезагружаем данные в accountsStore, чтобы Dashboard.vue увидел обновления
      await this.accountsStore.loadAccounts()

      alert('Балансы успешно пересчитаны по проводкам')
    },

    sortAccounts(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }
    }
  }
}

</script>

<style scoped>
.accounts-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 70px;
}

.favorite-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
  vertical-align: middle;
  cursor: pointer;
  transition: color 0.2s ease;
}

.favorite-icon.favorite {
  color: #ffcc00;
}

.favorite-icon:not(.favorite) {
  color: #ccc;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
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

.accounts-table {
  margin-bottom: 2rem;
}

.accounts-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.accounts-table th,
.accounts-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.accounts-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.accounts-table tr:hover {
  background-color: #f8f9fa;
}

.accounts-table tr.inactive-account {
  opacity: 0.7;
}

.amount {
  font-weight: 700;
  color: #333;
  text-align: right;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.status-badge.active {
  background-color: #28a745;
}

.status-badge.inactive {
  background-color: #dc3545;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.edit-button,
.delete-button {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  height: 100%;
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
  max-width: 500px;
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

.recalculate-button {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.recalculate-button:hover {
  background-color: #5a6268;
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
  .accounts-container {
    padding: 1rem;
  }
  
  .accounts-table th,
  .accounts-table td {
    padding: 0.75rem;
  }
  
  .form-card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>