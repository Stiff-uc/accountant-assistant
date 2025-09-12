import { DataService } from './dataService'
import { useAuthStore } from '../stores/authStore'
import { v4 as uuidv4 } from 'uuid'

export class LocalStorageService extends DataService {
  // Уникальные ключи для localStorage
  static ACCOUNTS_KEY = 'buhvue_accounts'
  static TRANSACTIONS_KEY = 'buhvue_transactions'
  static COUNTERPARTIES_KEY = 'buhvue_counterparties'

  constructor() {
    super()
    this.initData()
  }

  // Инициализация данных при первом запуске
  initData() {
    // Инициализация счетов
    if (!localStorage.getItem(LocalStorageService.ACCOUNTS_KEY)) {
      const defaultAccounts = [
        { id: uuidv4(), code: '10', name: 'Касса', type: 'asset', isActive: true, balance: 0 },
        { id: uuidv4(), code: '41', name: 'Расчетный счет', type: 'asset', isActive: true, balance: 0 },
        { id: uuidv4(), code: '43', name: 'Товары на складе', type: 'asset', isActive: true, balance: 0 },
        { id: uuidv4(), code: '60', name: 'Расчеты с поставщиками', type: 'liability', isActive: true, balance: 0 },
        { id: uuidv4(), code: '70', name: 'Расчеты с персоналом', type: 'liability', isActive: true, balance: 0 },
        { id: uuidv4(), code: '90', name: 'Продажи', type: 'income', isActive: true, balance: 0 },
        { id: uuidv4(), code: '20', name: 'Закупки', type: 'expense', isActive: true, balance: 0 },
        { id: uuidv4(), code: '44', name: 'Прочие расходы', type: 'expense', isActive: true, balance: 0 }
      ]
      localStorage.setItem(LocalStorageService.ACCOUNTS_KEY, JSON.stringify(defaultAccounts))
    }

    // Инициализация проводок
    if (!localStorage.getItem(LocalStorageService.TRANSACTIONS_KEY)) {
      localStorage.setItem(LocalStorageService.TRANSACTIONS_KEY, JSON.stringify([]))
    }

    // Инициализация контрагентов
    if (!localStorage.getItem(LocalStorageService.COUNTERPARTIES_KEY)) {
      localStorage.setItem(LocalStorageService.COUNTERPARTIES_KEY, JSON.stringify([]))
    }
  }

  // Счета
  async getAccounts() {
    const data = localStorage.getItem(LocalStorageService.ACCOUNTS_KEY)
    if (!data) return []
    const accounts = JSON.parse(data).map(account => ({
      ...account,
      balance: Number(account.balance) || 0
    }))
    console.log('Loaded accounts from localStorage:', accounts)
    return accounts
  }

  async getAccountById(id) {
    const accounts = await this.getAccounts()
    return accounts.find(a => a.id === id)
  }

  async createAccount(account) {
    const accounts = await this.getAccounts()
    const newAccount = {
      ...account,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      balance: Number(account.balance) || 0
    }
    accounts.push(newAccount)
    localStorage.setItem(LocalStorageService.ACCOUNTS_KEY, JSON.stringify(accounts))
    return newAccount
  }

  async updateAccount(id, account) {
    const accounts = await this.getAccounts()
    const index = accounts.findIndex(a => a.id === id)
    if (index !== -1) {
      accounts[index] = {
        ...accounts[index],
        ...account,
        balance: Number(account.balance) || 0,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(LocalStorageService.ACCOUNTS_KEY, JSON.stringify(accounts))
      return accounts[index]
    }
    return null
  }

  async deleteAccount(id) {
    const accounts = await this.getAccounts()
    const filtered = accounts.filter(a => a.id !== id)
    localStorage.setItem(LocalStorageService.ACCOUNTS_KEY, JSON.stringify(filtered))
  }

  // Проводки
  async getTransactions(filters = {}) {
    let transactions = JSON.parse(localStorage.getItem(LocalStorageService.TRANSACTIONS_KEY) || '[]')
    
    if (filters.date) {
      transactions = transactions.filter(t => t.date === filters.date)
    }
    
    if (filters.accountId) {
      transactions = transactions.filter(
        t => t.debitAccountId === filters.accountId || t.creditAccountId === filters.accountId
      )
    }
    
    return transactions
  }

  async getTransactionById(id) {
    const transactions = await this.getTransactions()
    return transactions.find(t => t.id === id)
  }

  async createTransaction(transaction) {
    const transactions = await this.getTransactions()
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    transactions.push(newTransaction)
    localStorage.setItem(LocalStorageService.TRANSACTIONS_KEY, JSON.stringify(transactions))
    return newTransaction
  }

  async updateTransaction(id, transaction) {
    const transactions = await this.getTransactions()
    const index = transactions.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...transaction, updatedAt: new Date().toISOString() }
      localStorage.setItem(LocalStorageService.TRANSACTIONS_KEY, JSON.stringify(transactions))
      return transactions[index]
    }
    return null
  }

  async deleteTransaction(id) {
    const transactions = await this.getTransactions()
    const filtered = transactions.filter(t => t.id !== id)
    localStorage.setItem(LocalStorageService.TRANSACTIONS_KEY, JSON.stringify(filtered))
  }

  // Контрагенты
  async getCounterparties() {
    const data = localStorage.getItem(LocalStorageService.COUNTERPARTIES_KEY)
    return data ? JSON.parse(data) : []
  }

  async getCounterpartyById(id) {
    const counterparties = await this.getCounterparties()
    return counterparties.find(c => c.id === id)
  }

  async createCounterparty(counterparty) {
    const counterparties = await this.getCounterparties()
    const newCounterparty = { ...counterparty, id: uuidv4(), createdAt: new Date().toISOString() }
    counterparties.push(newCounterparty)
    localStorage.setItem(LocalStorageService.COUNTERPARTIES_KEY, JSON.stringify(counterparties))
    return newCounterparty
  }

  async updateCounterparty(id, counterparty) {
    const counterparties = await this.getCounterparties()
    const index = counterparties.findIndex(c => c.id === id)
    if (index !== -1) {
      counterparties[index] = { ...counterparties[index], ...counterparty, updatedAt: new Date().toISOString() }
      localStorage.setItem(LocalStorageService.COUNTERPARTIES_KEY, JSON.stringify(counterparties))
      return counterparties[index]
    }
    return null
  }

  async deleteCounterparty(id) {
    const counterparties = await this.getCounterparties()
    const filtered = counterparties.filter(c => c.id !== id)
    localStorage.setItem(LocalStorageService.COUNTERPARTIES_KEY, JSON.stringify(filtered))
  }

  // Аутентификация
  async login(username, password) {
    const authStore = useAuthStore()
    return authStore.login(username, password)
  }

  async logout() {
    const authStore = useAuthStore()
    authStore.logout()
  }

  async getCurrentUser() {
    const authStore = useAuthStore()
    return authStore.user
  }
}