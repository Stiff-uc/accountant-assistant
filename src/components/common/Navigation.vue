<template>
  <nav class="navigation">
    <div class="nav-logo">
      <h2>Бухгалтерия</h2>
    </div>
    
    <ul class="nav-menu">
      <li v-if="isAuthenticated">
        <router-link to="/dashboard" class="nav-link">
          <span>📊</span> Дашборд
        </router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link to="/transactions" class="nav-link">
          <span>📝</span> Проводки
        </router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link to="/accounts" class="nav-link">
          <span>💰</span> Счета
        </router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link to="/counterparties" class="nav-link">
          <span>👥</span> Контрагенты
        </router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link to="/chess-report" class="nav-link">
          <span>♟️</span> Шахматка
        </router-link>
      </li>
      <li>
        <button @click="logout" class="nav-button">
          <span>🚪</span> Выйти
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'Navigation',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    return {
      authStore,
      router
    }
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated
    }
  },
  methods: {
    logout() {
      this.authStore.logout()
      this.router.push('/login')
    }
  }
}
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-logo h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #555;
}

.nav-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
    padding: 0.75rem;
  }
  
  .nav-logo h2 {
    font-size: 1.2rem;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .nav-link,
  .nav-button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>