import { defineStore } from 'pinia'
import dataServiceInstance from '../services/dataServiceInstance'

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
        const data = await dataServiceInstance.getAccounts()
        console.log('accountsStore.loadAccounts() loaded:', data)
        this.accounts = data
      } catch (error) {
        console.error('Failed to load accounts:', error)
      } finally {
        this.loading = false
      }
    },

    async createAccount(account) {
      const result = await dataServiceInstance.createAccount(account)
      this.accounts.push(result)
      return result
    },

    async updateAccount(id, account) {
      const index = this.accounts.findIndex(a => a.id === id)
      if (index !== -1) {
        const updated = await dataServiceInstance.updateAccount(id, account)
        this.accounts[index] = updated
        return updated
      }
    },

    async deleteAccount(id) {
      await dataServiceInstance.deleteAccount(id)
      this.accounts = this.accounts.filter(a => a.id !== id)
    }
  }
})