import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null
  }),

  actions: {
    async login(username, password) {
      // Предустановленные учетные данные
      if (username === 'admin' && password === 'admin') {
        this.isAuthenticated = true
        this.user = { username: 'admin' }
        localStorage.setItem('isAuthenticated', 'true')
        return true
      }
      return false
    },

    logout() {
      this.isAuthenticated = false
      this.user = null
      localStorage.removeItem('isAuthenticated')
    },

    checkAuth() {
      const savedAuth = localStorage.getItem('isAuthenticated')
      this.isAuthenticated = savedAuth === 'true'
      if (this.isAuthenticated) {
        this.user = { username: 'admin' }
      }
    }
  }
})