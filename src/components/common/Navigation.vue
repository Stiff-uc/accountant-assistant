<template>
  <nav class="navigation">
    <div class="nav-logo">
      <h5>Бухгалтерия</h5>
    </div>
    
    <button class="hamburger" @click="toggleMenu" aria-label="Открыть меню">
      <span></span>
      <span></span>
      <span></span>
    </button>
  
    <ul class="nav-menu" :class="{ 'nav-menu-active': isMenuOpen }">
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
import { ref } from 'vue'

export default {
  name: 'Navigation',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const isMenuOpen = ref(false)

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    return {
      authStore,
      router,
      isMenuOpen,
      toggleMenu
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
  position: relative;
}

.nav-logo h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.hamburger {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
  transition: 0.3s;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

.nav-menu-active {
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #333;
  padding: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
    padding: 0.75rem;
  }
  
  .nav-logo h2 {
    font-size: 1.2rem;
  }
  
  .hamburger {
    display: flex;
  }
  
  .nav-menu {
    display: none;
  }
  
  .nav-menu-active {
    display: flex;
  }
  
  .nav-link,
  .nav-button {
    width: 100%;
    text-align: left;
    justify-content: center;
    margin: 0.25rem 0;
  }
}

/* Force hamburger menu on all mobile screens regardless of orientation */
@media (max-width: 900px) {
  .hamburger {
    display: flex !important;
  }
  
  .nav-menu {
    display: none !important;
  }
  
  .nav-menu-active {
    display: flex !important;
  }
  .nav-link,
  .nav-button {
    width: 100%;
    text-align: left;
    justify-content: left;
    margin: 0 0;
  }  
}
</style>