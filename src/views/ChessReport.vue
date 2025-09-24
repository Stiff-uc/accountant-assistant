<template>
  <div class="chess-report-container">
    <h1>Шахматка</h1>

    <!-- Фильтры -->
    <div class="filters">
      <div class="filter-group">
        <label for="start-date">Дата начала</label>
        <input
          id="start-date"
          v-model="formStartDate"
          type="date"
          @change="hideReportDetails"
        />
      </div>
      
      <div class="filter-group">
        <label for="end-date">Дата окончания</label>
        <input
          id="end-date"
          v-model="formEndDate"
          type="date"
          @change="hideReportDetails"
        />
      </div>

      <div class="filter-group">
        <label for="account-filter">Счёт</label>
        <select id="account-filter" v-model="formAccountId" @change="hideReportDetails">
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

      <button @click="generateReport" class="filter-button">
        Сгенерировать
      </button>
    </div>

    <!-- Шахматная ведомость -->
    <div class="chess-board" v-if="showReportDetails && reportData.length > 0">
      <div class="chess-header">
        <div class="chess-cell empty"></div>
        <div
          class="chess-cell account-header"
          v-for="account in accountsStore.accounts"
          :key="account.id"
        >
          {{ account.code }}<br>{{ account.name }}
        </div>
      </div>

      <div
        class="chess-row"
        v-for="debitAccount in accountsStore.accounts"
        :key="debitAccount.id"
      >
        <div class="chess-cell account-header">
          {{ debitAccount.code }}<br>{{ debitAccount.name }}
        </div>
        
        <div
          class="chess-cell"
          v-for="creditAccount in accountsStore.accounts"
          :key="creditAccount.id"
          :class="{
            'debit-credit': getBalance(debitAccount.id, creditAccount.id) > 0,
            'credit-debit': getBalance(debitAccount.id, creditAccount.id) < 0,
            'zero': getBalance(debitAccount.id, creditAccount.id) === 0
          }"
        >
          {{ formatCurrency(getBalance(debitAccount.id, creditAccount.id)) }}
        </div>
      </div>
    </div>

    <div v-else-if="showReportDetails" class="no-data">
      Нет данных
    </div>

    <!-- Сводка -->
    <div class="summary" v-if="showReportDetails">
      <h3>Сводка</h3>
      <div class="summary-item">
        <span>Всего дебетов:</span>
        <span class="amount">{{ formatCurrency(totalDebits) }}</span>
      </div>
      <div class="summary-item">
        <span>Всего кредитов:</span>
        <span class="amount">{{ formatCurrency(totalCredits) }}</span>
      </div>
      <div class="summary-item">
        <span>Чистый баланс:</span>
        <span class="amount">{{ formatCurrency(netBalance) }}</span>
      </div>
    </div>
    
    <div v-else class="no-data">
      Нажмите "Сгенерировать" для отображения отчета
    </div>
  </div>
</template>

<script>
import { useAccountsStore } from '../stores/accountsStore'
import { useTransactionsStore } from '../stores/transactionsStore'

export default {
  name: 'ChessReport',
  data() {
    return {
      accountsStore: useAccountsStore(),
      transactionsStore: useTransactionsStore(),
      // Form parameters
      formStartDate: '',
      formEndDate: '',
      formAccountId: '',
      // Report data
      reportData: [],
      filteredTransactions: [],
      showReportDetails: false
    }
  },
  computed: {
    totalDebits() {
      return this.reportData.reduce((sum, row) => {
        return sum + row.reduce((rowSum, cell) => {
          return rowSum + (cell > 0 ? cell : 0)
        }, 0)
      }, 0)
    },
    
    totalCredits() {
      return this.reportData.reduce((sum, row) => {
        return sum + row.reduce((rowSum, cell) => {
          return rowSum + (cell < 0 ? Math.abs(cell) : 0)
        }, 0)
      }, 0)
    },
    
    netBalance() {
      return this.totalDebits - this.totalCredits
    }
  },
  mounted() {
    this.accountsStore.loadAccounts()
    this.transactionsStore.loadTransactions()
    
    // Устанавливаем диапазон дат: начало текущего месяца и сегодня
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    this.formEndDate = today.toISOString().split('T')[0]
    this.formStartDate = firstDayOfMonth.toISOString().split('T')[0]
    
    // Инициализируем пустые массивы для данных отчета
    this.filteredTransactions = []
    this.reportData = []
    
    // Не показываем детали отчета до нажатия кнопки
    this.showReportDetails = false
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(amount)
    },
    
    getBalance(debitAccountId, creditAccountId) {
      // Если это диагональ (счет сам с собой), возвращаем 0
      if (debitAccountId === creditAccountId) return 0
      
      // Используем уже отфильтрованные проводки
      const transactions = this.filteredTransactions.filter(t => {
        const matchesDebit = t.debitAccountId === debitAccountId && t.creditAccountId === creditAccountId
        const matchesCredit = t.debitAccountId === creditAccountId && t.creditAccountId === debitAccountId
        return matchesDebit || matchesCredit
      })
      
      // Суммируем все проводки
      let balance = 0
      transactions.forEach(t => {
        if (t.debitAccountId === debitAccountId && t.creditAccountId === creditAccountId) {
          balance += t.amount
        } else if (t.debitAccountId === creditAccountId && t.creditAccountId === debitAccountId) {
          balance -= t.amount
        }
      })
      
      return balance
    },
    
    hideReportDetails() {
      this.showReportDetails = false
    },
    
    generateReport() {
      // Фильтруем проводки на основе параметров формы
      this.filteredTransactions = this.transactionsStore.transactions.filter(t => {
        // Применяем фильтр по диапазону дат, если выбраны обе даты
        if (this.formStartDate && this.formEndDate) {
          if (t.date < this.formStartDate || t.date > this.formEndDate) {
            return false
          }
        }
        
        // Применяем фильтр по счету, если выбран
        if (this.formAccountId) {
          if (t.debitAccountId !== this.formAccountId && t.creditAccountId !== this.formAccountId) {
            return false
          }
        }
        
        return true
      })
      
      // Создаем матрицу для шахматной ведомости
      this.reportData = []
      
      this.accountsStore.accounts.forEach(debitAccount => {
        const row = []
        this.accountsStore.accounts.forEach(creditAccount => {
          row.push(this.getBalance(debitAccount.id, creditAccount.id))
        })
        this.reportData.push(row)
      })
      
      // Показываем детали отчета после генерации
      this.showReportDetails = true
    }
  }
}
</script>

<style scoped>
.chess-report-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.filter-button {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1.5rem;
  background-color: #007bff;
  color: white;
}

.filter-button:hover {
  background-color: #0056b3;
}

.chess-board {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.chess-header,
.chess-row {
  display: flex;
}

.chess-cell {
  flex: 1;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  font-size: 0.8rem;
  text-align: center;
  padding: 0.25rem;
  min-width: 0; /* сбрасываем min-width, чтобы flex работал */
  word-wrap: normal; /* отключаем перенос, чтобы не ломал выравнивание */
}

.chess-cell.empty {
  background-color: #f8f9fa;
  border: none;
}

.chess-cell.account-header {
  background-color: #e9ecef;
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
}

.chess-cell.debit-credit {
  background-color: #e8f5e9;
  color: #2e7d32;
  font-weight: 600;
}

.chess-cell.credit-debit {
  background-color: #ffebee;
  color: #d32f2f;
  font-weight: 600;
}

.chess-cell.zero {
  background-color: #f5f5f5;
  color: #999;
}

.summary {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.summary h3 {
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 6px;
}

.summary-item .amount {
  font-weight: 700;
  color: #333;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 3rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .chess-report-container {
    padding: 1rem;
  }
  
  .filters {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .chess-cell {
    min-width: 80px;
    height: 50px;
    font-size: 0.7rem;
  }
  
  .chess-cell.account-header {
    font-size: 0.75rem;
  }
  
  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .summary-item .amount {
    margin-left: 1rem;
  }
}
</style>