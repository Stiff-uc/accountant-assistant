import { defineStore } from 'pinia'
import { LocalStorageService } from '../services/localStorageService'

export const useCounterpartiesStore = defineStore('counterparties', {
  state: () => ({
    counterparties: [],
    loading: false
  }),

  getters: {
    getCounterpartyById: (state) => (id) => {
      return state.counterparties.find(c => c.id === id)
    },
    getCounterpartyByName: (state) => (name) => {
      return state.counterparties.find(c => c.name.toLowerCase().includes(name.toLowerCase()))
    }
  },

  actions: {
    async loadCounterparties() {
      this.loading = true
      try {
        const data = await new LocalStorageService().getCounterparties()
        this.counterparties = data
      } catch (error) {
        console.error('Failed to load counterparties:', error)
      } finally {
        this.loading = false
      }
    },

    async createCounterparty(counterparty) {
      const result = await new LocalStorageService().createCounterparty(counterparty)
      this.counterparties.push(result)
      return result
    },

    async updateCounterparty(id, counterparty) {
      const index = this.counterparties.findIndex(c => c.id === id)
      if (index !== -1) {
        const updated = await new LocalStorageService().updateCounterparty(id, counterparty)
        this.counterparties[index] = updated
        return updated
      }
    },

    async deleteCounterparty(id) {
      await new LocalStorageService().deleteCounterparty(id)
      this.counterparties = this.counterparties.filter(c => c.id !== id)
    }
  }
})