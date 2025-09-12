import { Account } from './Account'

export class Transaction {
  constructor(data = {}) {
    this.id = data.id || ''
    this.date = data.date ? new Date(data.date) : new Date()
    this.description = data.description || ''
    this.debitAccountId = data.debitAccountId || ''
    this.creditAccountId = data.creditAccountId || ''
    this.amount = data.amount || 0
    this.counterpartyId = data.counterpartyId || ''
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  // Валидация данных
  validate() {
    const errors = []
    
    if (!this.date || isNaN(this.date.getTime())) errors.push('Дата должна быть корректной')
    if (!this.debitAccountId.trim()) errors.push('Счет дебета обязателен')
    if (!this.creditAccountId.trim()) errors.push('Счет кредита обязателен')
    if (this.debitAccountId === this.creditAccountId) errors.push('Счет дебета и кредита не могут быть одинаковыми')
    if (typeof this.amount !== 'number' || this.amount <= 0 || isNaN(this.amount)) 
      errors.push('Сумма должна быть положительным числом')
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Проверка, что проводка сбалансирована (дебет = кредит)
  isBalanced() {
    return this.debitAccountId !== '' && this.creditAccountId !== '' && this.amount > 0
  }

  // Преобразование в объект для хранения
  toSerializable() {
    return {
      id: this.id,
      date: this.date.toISOString(),
      description: this.description,
      debitAccountId: this.debitAccountId,
      creditAccountId: this.creditAccountId,
      amount: this.amount,
      counterpartyId: this.counterpartyId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}