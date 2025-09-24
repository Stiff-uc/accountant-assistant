import { defineStore } from 'pinia'
import { LocalStorageService } from '../services/localStorageService'
import { useAccountsStore } from './accountsStore'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    loading: false
  }),

  getters: {
    getTransactionById: (state) => (id) => {
      return state.transactions.find(t => t.id === id)
    },
    getTransactionsByDate: (state) => (date) => {
      return state.transactions.filter(t => t.date === date)
    },
    getTransactionsByAccount: (state) => (accountId) => {
      return state.transactions.filter(
        t => t.debitAccountId === accountId || t.creditAccountId === accountId
      )
    },
    getNetBalance: (state) => {
      return state.transactions.reduce((sum, t) => {
        return sum + t.amount
      }, 0)
    }
  },

  actions: {
    async loadTransactions() {
      this.loading = true
      try {
        const data = await new LocalStorageService().getTransactions()
        this.transactions = data
      } catch (error) {
        console.error('Failed to load transactions:', error)
      } finally {
        this.loading = false
      }
    },

    async createTransaction(transaction) {
      const result = await new LocalStorageService().createTransaction(transaction)
      this.transactions.push(result)

      // Обновляем остатки по счетам
      const debitAccount = useAccountsStore().getAccountById(transaction.debitAccountId)
      const creditAccount = useAccountsStore().getAccountById(transaction.creditAccountId)
      
      if (debitAccount) {
        // Для дебетового счета: увеличиваем баланс для активов и расходов, уменьшаем для обязательств и доходов
        let newBalance
        if (debitAccount.type === 'asset' || debitAccount.type === 'expense') {
          newBalance = debitAccount.balance + transaction.amount
        } else { // liability, income
          newBalance = debitAccount.balance - transaction.amount
        }
        const updatedDebitAccount = { ...debitAccount, balance: newBalance }
        console.log('Updating debit account:', updatedDebitAccount)
        await useAccountsStore().updateAccount(debitAccount.id, updatedDebitAccount)
      }
      if (creditAccount) {
        // Для кредитового счета: уменьшаем баланс для активов и расходов, увеличиваем для обязательств и доходов
        let newBalance
        if (creditAccount.type === 'asset' || creditAccount.type === 'expense') {
          newBalance = creditAccount.balance - transaction.amount
        } else { // liability, income
          newBalance = creditAccount.balance + transaction.amount
        }
        const updatedCreditAccount = { ...creditAccount, balance: newBalance }
        console.log('Updating credit account:', updatedCreditAccount)
        await useAccountsStore().updateAccount(creditAccount.id, updatedCreditAccount)
      }

      return result
    },

    async updateTransaction(id, transaction) {
      const index = this.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        const originalTransaction = this.transactions[index]
        
        // Обновляем проводку в хранилище
        const updated = await new LocalStorageService().updateTransaction(id, transaction)
        this.transactions[index] = updated
        
        // Восстанавливаем остатки по счетам для исходной проводки
        const originalDebitAccount = useAccountsStore().getAccountById(originalTransaction.debitAccountId)
        const originalCreditAccount = useAccountsStore().getAccountById(originalTransaction.creditAccountId)
        
        if (originalDebitAccount) {
          // Для дебетового счета откат: уменьшаем баланс для активов и расходов, увеличиваем для обязательств и доходов
          let newBalance
          if (originalDebitAccount.type === 'asset' || originalDebitAccount.type === 'expense') {
            newBalance = originalDebitAccount.balance - originalTransaction.amount
          } else { // liability, income
            newBalance = originalDebitAccount.balance + originalTransaction.amount
          }
          const restoredDebitAccount = { ...originalDebitAccount, balance: newBalance }
          console.log('Rolling back old debit account:', restoredDebitAccount)
          await useAccountsStore().updateAccount(originalDebitAccount.id, restoredDebitAccount)
        }
        if (originalCreditAccount) {
          // Для кредитового счета откат: увеличиваем баланс для активов и расходов, уменьшаем для обязательств и доходов
          let newBalance
          if (originalCreditAccount.type === 'asset' || originalCreditAccount.type === 'expense') {
            newBalance = originalCreditAccount.balance + originalTransaction.amount
          } else { // liability, income
            newBalance = originalCreditAccount.balance - originalTransaction.amount
          }
          const restoredCreditAccount = { ...originalCreditAccount, balance: newBalance }
          console.log('Rolling back old credit account:', restoredCreditAccount)
          await useAccountsStore().updateAccount(originalCreditAccount.id, restoredCreditAccount)
        }
        
        // Обновляем остатки по счетам для измененной проводки
        const debitAccount = useAccountsStore().getAccountById(transaction.debitAccountId)
        const creditAccount = useAccountsStore().getAccountById(transaction.creditAccountId)
        
        if (debitAccount) {
          // Для дебетового счета: увеличиваем баланс для активов и расходов, уменьшаем для обязательств и доходов
          let newBalance
          if (debitAccount.type === 'asset' || debitAccount.type === 'expense') {
            newBalance = debitAccount.balance + transaction.amount
          } else { // liability, income
            newBalance = debitAccount.balance - transaction.amount
          }
          const updatedDebitAccount = { ...debitAccount, balance: newBalance }
          console.log('Updating new debit account:', updatedDebitAccount)
          await useAccountsStore().updateAccount(debitAccount.id, updatedDebitAccount)
        }
        if (creditAccount) {
          // Для кредитового счета: уменьшаем баланс для активов и расходов, увеличиваем для обязательств и доходов
          let newBalance
          if (creditAccount.type === 'asset' || creditAccount.type === 'expense') {
            newBalance = creditAccount.balance - transaction.amount
          } else { // liability, income
            newBalance = creditAccount.balance + transaction.amount
          }
          const updatedCreditAccount = { ...creditAccount, balance: newBalance }
          console.log('Updating new credit account:', updatedCreditAccount)
          await useAccountsStore().updateAccount(creditAccount.id, updatedCreditAccount)
        }
        
        return updated
      }
    },

    async deleteTransaction(id) {
      const transaction = this.getTransactionById(id)
      if (!transaction) return

      await new LocalStorageService().deleteTransaction(id)
      this.transactions = this.transactions.filter(t => t.id !== id)

      // Восстанавливаем остатки по счетам
      const debitAccount = useAccountsStore().getAccountById(transaction.debitAccountId)
      const creditAccount = useAccountsStore().getAccountById(transaction.creditAccountId)
      
      if (debitAccount) {
        // Для дебетового счета откат: уменьшаем баланс для активов и расходов, увеличиваем для обязательств и доходов
        let newBalance
        if (debitAccount.type === 'asset' || debitAccount.type === 'expense') {
          newBalance = debitAccount.balance - transaction.amount
        } else { // liability, income
          newBalance = debitAccount.balance + transaction.amount
        }
        const updatedDebitAccount = { ...debitAccount, balance: newBalance }
        console.log('Rolling back debit account:', updatedDebitAccount)
        await useAccountsStore().updateAccount(debitAccount.id, updatedDebitAccount)
      }
      if (creditAccount) {
        // Для кредитового счета откат: увеличиваем баланс для активов и расходов, уменьшаем для обязательств и доходов
        let newBalance
        if (creditAccount.type === 'asset' || creditAccount.type === 'expense') {
          newBalance = creditAccount.balance + transaction.amount
        } else { // liability, income
          newBalance = creditAccount.balance - transaction.amount
        }
        const updatedCreditAccount = { ...creditAccount, balance: newBalance }
        console.log('Rolling back credit account:', updatedCreditAccount)
        await useAccountsStore().updateAccount(creditAccount.id, updatedCreditAccount)
      }
    }
  }
})