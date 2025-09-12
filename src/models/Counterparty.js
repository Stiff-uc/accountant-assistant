export class Counterparty {
  constructor(data = {}) {
    this.id = data.id || ''
    this.name = data.name || ''
    this.inn = data.inn || ''
    this.address = data.address || ''
    this.phone = data.phone || ''
    this.email = data.email || ''
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  // Валидация данных
  validate() {
    const errors = []
    
    if (!this.name.trim()) errors.push('Наименование контрагента обязательно')
    
    // Проверка ИНН (если указан)
    if (this.inn && !/^\d{10}$|^\d{12}$/.test(this.inn)) {
      errors.push('ИНН должен содержать 10 или 12 цифр')
    }
    
    // Проверка телефона (если указан)
    if (this.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(this.phone)) {
      errors.push('Телефон должен содержать только цифры, пробелы, дефисы и скобки')
    }
    
    // Проверка email (если указан)
    if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('Email должен быть в корректном формате')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Преобразование в объект для хранения
  toSerializable() {
    return {
      id: this.id,
      name: this.name,
      inn: this.inn,
      address: this.address,
      phone: this.phone,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}