<template>
  <div class="wizard-container">
    <h1>Выберите, какие счета вы хотите создать</h1>
    
    <div class="option-card" @click="selectAccounts('default')">
      <h2>Стандартный набор</h2>
      <p class="hint">
        Касса, Расчетный счет, Товары на складе, Расчеты с поставщиками, 
        Расчеты с персоналом, Продажи, Закупки, Прочие расходы
      </p>
    </div>

    <div class="option-card" @click="selectAccounts('school')">
      <h2>Школьный общий бюджет</h2>
      <p class="hint">
        Общая касса, Сборы с родителей, Пожертвования, Учебные материалы, 
        Культурные мероприятия, Дни рождения и праздники, Транспорт и поездки, Прочие расходы
      </p>
    </div>

    <button class="logout-button" @click="logout">
      Выйти
    </button>
  </div>
</template>

<script>
import { LocalStorageService } from '../services/localStorageService'
import { useRouter } from 'vue-router'

export default {
  name: 'Wizard',
  methods: {
    async selectAccounts(type) {
      await LocalStorageService.createDefaultAccounts(type)
      this.$router.push('/login')
    },
    logout() {
      localStorage.removeItem('isAuthenticated')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.wizard-container {
  max-width: 600px;
  margin: 80px auto;
  padding: 2rem;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.wizard-container h1 {
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 1.8rem;
}

.option-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  margin: 1.5rem auto;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 80%;
  max-width: 500px;
}

.option-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.option-card h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

.hint {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.logout-button {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>