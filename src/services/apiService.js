import { DataService } from './dataService'

// Заготовка для будущего взаимодействия с Spring Boot API
export class ApiService extends DataService {
  constructor() {
    super()
    this.baseURL = 'http://localhost:8080/api' // URL Spring Boot сервера
  }

  // Методы для работы со счетами
  async getAccounts() {
    const response = await fetch(`${this.baseURL}/accounts`)
    if (!response.ok) throw new Error('Failed to fetch accounts')
    return await response.json()
  }

  async getAccountById(id) {
    const response = await fetch(`${this.baseURL}/accounts/${id}`)
    if (!response.ok) throw new Error('Failed to fetch account')
    return await response.json()
  }

  async createAccount(account) {
    const response = await fetch(`${this.baseURL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account)
    })
    if (!response.ok) throw new Error('Failed to create account')
    return await response.json()
  }

  async updateAccount(id, account) {
    const response = await fetch(`${this.baseURL}/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account)
    })
    if (!response.ok) throw new Error('Failed to update account')
    return await response.json()
  }

  async deleteAccount(id) {
    const response = await fetch(`${this.baseURL}/accounts/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete account')
  }

  // Методы для работы с проводками
  async getTransactions(filters = {}) {
    let url = `${this.baseURL}/transactions`
    const params = new URLSearchParams(filters)
    if (params.toString()) url += `?${params.toString()}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch transactions')
    return await response.json()
  }

  async getTransactionById(id) {
    const response = await fetch(`${this.baseURL}/transactions/${id}`)
    if (!response.ok) throw new Error('Failed to fetch transaction')
    return await response.json()
  }

  async createTransaction(transaction) {
    const response = await fetch(`${this.baseURL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    })
    if (!response.ok) throw new Error('Failed to create transaction')
    return await response.json()
  }

  async updateTransaction(id, transaction) {
    const response = await fetch(`${this.baseURL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    })
    if (!response.ok) throw new Error('Failed to update transaction')
    return await response.json()
  }

  async deleteTransaction(id) {
    const response = await fetch(`${this.baseURL}/transactions/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete transaction')
  }

  // Методы для работы с контрагентами
  async getCounterparties() {
    const response = await fetch(`${this.baseURL}/counterparties`)
    if (!response.ok) throw new Error('Failed to fetch counterparties')
    return await response.json()
  }

  async getCounterpartyById(id) {
    const response = await fetch(`${this.baseURL}/counterparties/${id}`)
    if (!response.ok) throw new Error('Failed to fetch counterparty')
    return await response.json()
  }

  async createCounterparty(counterparty) {
    const response = await fetch(`${this.baseURL}/counterparties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(counterparty)
    })
    if (!response.ok) throw new Error('Failed to create counterparty')
    return await response.json()
  }

  async updateCounterparty(id, counterparty) {
    const response = await fetch(`${this.baseURL}/counterparties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(counterparty)
    })
    if (!response.ok) throw new Error('Failed to update counterparty')
    return await response.json()
  }

  async deleteCounterparty(id) {
    const response = await fetch(`${this.baseURL}/counterparties/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete counterparty')
  }

  // Аутентификация
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    
    if (!response.ok) return false
    
    const data = await response.json()
    localStorage.setItem('authToken', data.token)
    return true
  }

  async logout() {
    localStorage.removeItem('authToken')
  }

  async getCurrentUser() {
    const token = localStorage.getItem('authToken')
    if (!token) return null
    
    // В будущем можно запросить информацию о пользователе через API
    return { username: 'admin' }
  }
}