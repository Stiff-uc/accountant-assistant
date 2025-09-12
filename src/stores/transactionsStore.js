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
        const updatedDebitAccount = { ...debitAccount, balance: debitAccount.balance - transaction.amount }
        useAccountsStore().updateAccount(debitAccount.id, updatedDebitAccount)
      }
      if (creditAccount) {
        const updatedCreditAccount = { ...creditAccount, balance: creditAccount.balance + transaction.amount }
        useAccountsStore().updateAccount(creditAccount.id, updatedCreditAccount)
      }

      return result
    },

    async updateTransaction(id, transaction) {
      const index = this.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        const updated = await new LocalStorageService().updateTransaction(id, transaction)
        this.transactions[index] = updated
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
        const updatedDebitAccount = { ...debitAccount, balance: debitAccount.balance + transaction.amount }
        useAccountsStore().updateAccount(debitAccount.id, updatedDebitAccount)
      }
      if (creditAccount) {
        const updatedCreditAccount = { ...creditAccount, balance: creditAccount.balance - transaction.amount }
        useAccountsStore().updateAccount(creditAccount.id, updatedCreditAccount)
      }
    }
  }
})