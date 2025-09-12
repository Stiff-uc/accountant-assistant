<template>
  <div class="counterparties-container">
    <h1>Контрагенты</h1>

    <!-- Действия -->
    <div class="actions">
      <button @click="openCounterpartyForm" class="add-button">
        Добавить контрагента
      </button>
    </div>

    <!-- Таблица контрагентов -->
    <div class="counterparties-table">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>ИНН</th>
            <th>Телефон</th>
            <th>Электронная почта</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="counterparty in counterpartiesStore.counterparties"
            :key="counterparty.id"
          >
            <td>{{ counterparty.name }}</td>
            <td>{{ counterparty.inn || '-' }}</td>
            <td>{{ counterparty.phone || '-' }}</td>
            <td>{{ counterparty.email || '-' }}</td>
            <td class="actions">
              <button @click="editCounterparty(counterparty)" class="edit-button">
                Редактировать
              </button>
              <button @click="deleteCounterparty(counterparty)" class="delete-button">
                Удалить
              </button>
            </td>
          </tr>
          <tr v-if="counterpartiesStore.counterparties.length === 0">
            <td colspan="5" class="no-data">
              Нет контрагентов
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Карточки контрагентов (для мобильных) -->
    <div class="counterparties-cards">
      <div
        v-for="counterparty in counterpartiesStore.counterparties"
        :key="counterparty.id"
        class="counterparty-card"
      >
        <h3>{{ counterparty.name }}</h3>
        <p><strong>ИНН:</strong> {{ counterparty.inn || '-' }}</p>
        <p><strong>Телефон:</strong> {{ counterparty.phone || '-' }}</p>
        <p><strong>Email:</strong> {{ counterparty.email || '-' }}</p>
        <div class="card-actions">
          <button @click="editCounterparty(counterparty)" class="edit-button">
            Редактировать
          </button>
          <button @click="deleteCounterparty(counterparty)" class="delete-button">
            Удалить
          </button>
        </div>
      </div>
      <div v-if="counterpartiesStore.counterparties.length === 0" class="no-data-card">
        Нет контрагентов
      </div>
    </div>

    <!-- Форма добавления/редактирования -->
    <div v-if="showForm" class="form-overlay">
      <div class="form-card">
        <h2>{{ editingCounterparty ? 'Редактировать контрагента' : 'Добавить контрагента' }}</h2>
        
        <form @submit.prevent="saveCounterparty">
          <div class="form-group">
            <label for="counterparty-name">Название</label>
            <input
              id="counterparty-name"
              v-model="form.name"
              type="text"
              required
              placeholder="Введите название"
            />
          </div>

          <div class="form-group">
            <label for="counterparty-inn">ИНН</label>
            <input
              id="counterparty-inn"
              v-model="form.inn"
              type="text"
              placeholder="Введите ИНН"
            />
          </div>

          <div class="form-group">
            <label for="counterparty-phone">Телефон</label>
            <input
              id="counterparty-phone"
              v-model="form.phone"
              type="text"
              placeholder="Введите телефон"
            />
          </div>

          <div class="form-group">
            <label for="counterparty-email">Электронная почта</label>
            <input
              id="counterparty-email"
              v-model="form.email"
              type="email"
              placeholder="Введите email"
            />
          </div>

          <div class="form-group">
            <label for="counterparty-address">Адрес</label>
            <input
              id="counterparty-address"
              v-model="form.address"
              type="text"
              placeholder="Введите адрес"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="save-button">
              Сохранить
            </button>
            <button type="button" @click="cancelForm" class="cancel-button">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useCounterpartiesStore } from '../stores/counterpartiesStore'
import { Counterparty } from '../models/Counterparty'

export default {
  name: 'Counterparties',
  data() {
    return {
      counterpartiesStore: useCounterpartiesStore(),
      showForm: false,
      editingCounterparty: null,
      form: {
        name: '',
        inn: '',
        phone: '',
        email: '',
        address: ''
      }
    }
  },
  mounted() {
    this.counterpartiesStore.loadCounterparties()
  },
  methods: {
    openCounterpartyForm() {
      this.editingCounterparty = null
      this.form = {
        name: '',
        inn: '',
        phone: '',
        email: '',
        address: ''
      }
      this.showForm = true
    },
    
    editCounterparty(counterparty) {
      this.editingCounterparty = counterparty
      this.form = {
        name: counterparty.name,
        inn: counterparty.inn,
        phone: counterparty.phone,
        email: counterparty.email,
        address: counterparty.address
      }
      this.showForm = true
    },
    
    async saveCounterparty() {
      // Валидация
      const counterparty = {
        id: this.editingCounterparty?.id || '',
        name: this.form.name,
        inn: this.form.inn,
        phone: this.form.phone,
        email: this.form.email,
        address: this.form.address
      }
      
      const counterpartyModel = new Counterparty(counterparty)
      const { isValid, errors } = counterpartyModel.validate()
      if (!isValid) {
        alert('Пожалуйста, исправьте ошибки в форме')
        return
      }
      
      try {
        if (this.editingCounterparty) {
          await this.counterpartiesStore.updateCounterparty(this.editingCounterparty.id, counterparty)
        } else {
          await this.counterpartiesStore.createCounterparty(counterparty)
        }
        
        this.showForm = false
        this.editingCounterparty = null
      } catch (error) {
        alert('Не удалось сохранить контрагента')
      }
    },
    
    async deleteCounterparty(counterparty) {
      if (!confirm('Вы уверены, что хотите удалить этого контрагента?')) return
      
      try {
        await this.counterpartiesStore.deleteCounterparty(counterparty.id)
      } catch (error) {
        alert('Не удалось удалить контрагента')
      }
    },
    
    cancelForm() {
      this.showForm = false
      this.editingCounterparty = null
    }
  }
}
</script>

<style scoped>
.counterparties-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Стили карточек для мобильной версии */
.counterparties-cards {
  display: none;
  margin-top: 2rem;
}

.counterparty-card {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.counterparty-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
}

.counterparty-card p {
  margin: 0.3rem 0;
  color: #555;
  font-size: 0.95rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.no-data-card {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
  font-size: 1.1rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.add-button {
  padding: 0.75rem 2rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #218838;
}

.counterparties-table {
  margin-bottom: 2rem;
}

.counterparties-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  table-layout: fixed;
}

.counterparties-table th,
.counterparties-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.counterparties-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.counterparties-table tr:hover {
  background-color: #f8f9fa;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.edit-button {
  background-color: #17a2b8;
  color: white;
}

.edit-button:hover {
  background-color: #138496;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
  font-size: 1.1rem;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-card h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.save-button,
.cancel-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

@media (max-width: 899px) {
  .counterparties-container {
    padding: 1rem;
  }
  
  .counterparties-table th,
  .counterparties-table td {
    padding: 0.75rem;
  }
  
  .form-card {
    margin: 1rem;
    padding: 1.5rem;
  }

  /* Скрываем таблицу на мобильных */
  .counterparties-table {
    display: none;
  }

  /* Показываем карточки на мобильных */
  .counterparties-cards {
    display: block;
  }
}

/* Для десктопа: скрываем карточки, показываем таблицу */
@media (min-width: 900px) {
  .counterparties-cards {
    display: none;
  }

  .counterparties-table {
    display: table;
  }
}
</style>