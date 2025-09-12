import { defineStore } from 'pinia'
import { LocalStorageService } from '../services/localStorageService'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [],
    loading: false
  }),

  getters: {
    getAccountById: (state) => (id) => {
      return state.accounts.find(account => account.id === id)
    }
  },

  actions: {
    async loadAccounts() {
      this.loading = true
      try {
        const data = await new LocalStorageService().getAccounts()
        console.log('accountsStore.loadAccounts() loaded:', data)
        this.accounts = data
      } catch (error) {
        console.error('Failed to load accounts:', error)
      } finally {
        this.loading = false
      }
    },

    async createAccount(account) {
      const result = await new LocalStorageService().createAccount(account)
      this.accounts.push(result)
      return result
    },

    async updateAccount(id, account) {
      const index = this.accounts.findIndex(a => a.id === id)
      if (index !== -1) {
        const updated = await new LocalStorageService().updateAccount(id, account)
        this.accounts[index] = updated
        return updated
      }
    },

    async deleteAccount(id) {
      await new LocalStorageService().deleteAccount(id)
      this.accounts = this.accounts.filter(a => a.id !== id)
    }
  }
})