// Абстрактный сервис данных — базовый класс для всех реализаций
export class DataService {
  // Методы для работы со счетами
  async getAccounts() {
    throw new Error('Метод getAccounts() должен быть реализован в подклассе')
  }
  
  async getAccountById(id) {
    throw new Error('Метод getAccountById() должен быть реализован в подклассе')
  }
  
  async createAccount(account) {
    throw new Error('Метод createAccount() должен быть реализован в подклассе')
  }
  
  async updateAccount(id, account) {
    throw new Error('Метод updateAccount() должен быть реализован в подклассе')
  }
  
  async deleteAccount(id) {
    throw new Error('Метод deleteAccount() должен быть реализован в подклассе')
  }
  
  // Методы для работы с проводками
  async getTransactions(filters = {}) {
    throw new Error('Метод getTransactions() должен быть реализован в подклассе')
  }
  
  async getTransactionById(id) {
    throw new Error('Метод getTransactionById() должен быть реализован в подклассе')
  }
  
  async createTransaction(transaction) {
    throw new Error('Метод createTransaction() должен быть реализован в подклассе')
  }
  
  async updateTransaction(id, transaction) {
    throw new Error('Метод updateTransaction() должен быть реализован в подклассе')
  }
  
  async deleteTransaction(id) {
    throw new Error('Метод deleteTransaction() должен быть реализован в подклассе')
  }
  
  // Методы для работы с контрагентами
  async getCounterparties() {
    throw new Error('Метод getCounterparties() должен быть реализован в подклассе')
  }
  
  async getCounterpartyById(id) {
    throw new Error('Метод getCounterpartyById() должен быть реализован в подклассе')
  }
  
  async createCounterparty(counterparty) {
    throw new Error('Метод createCounterparty() должен быть реализован в подклассе')
  }
  
  async updateCounterparty(id, counterparty) {
    throw new Error('Метод updateCounterparty() должен быть реализован в подклассе')
  }
  
  async deleteCounterparty(id) {
    throw new Error('Метод deleteCounterparty() должен быть реализован в подклассе')
  }
  
  // Методы для аутентификации
  async login(username, password) {
    throw new Error('Метод login() должен быть реализован в подклассе')
  }
  
  async logout() {
    throw new Error('Метод logout() должен быть реализован в подклассе')
  }
  
  async getCurrentUser() {
    throw new Error('Метод getCurrentUser() должен быть реализован в подклассе')
  }

  // Проверка аутентификации
  async isAuthenticated() {
    throw new Error('Метод isAuthenticated() должен быть реализован в подклассе')
  }
}