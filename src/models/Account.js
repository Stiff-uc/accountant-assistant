export class Account {
  constructor(data = {}) {
    this.id = data.id || ''
    this.code = data.code || ''
    this.name = data.name || ''
    this.type = data.type || 'asset' // asset, liability, income, expense
    this.isActive = data.isActive !== undefined ? data.isActive : true
    this.balance = data.balance || 0
    this.isFavorite = data.isFavorite !== undefined ? data.isFavorite : false
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  // Валидация данных
  validate() {
    const errors = []
    
    if (!this.code.trim()) errors.push('Код счета обязателен')
    if (!this.name.trim()) errors.push('Наименование счета обязательно')
    if (!['asset', 'liability', 'income', 'expense'].includes(this.type)) 
      errors.push('Тип счета должен быть: asset, liability, income или expense')
    if (typeof this.balance !== 'number' || isNaN(this.balance)) 
      errors.push('Баланс должен быть числом')
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Преобразование в объект для хранения
  toSerializable() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      type: this.type,
      isActive: this.isActive,
      balance: this.balance,
      isFavorite: this.isFavorite,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}