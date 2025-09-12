import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import { LocalStorageService } from './services/localStorageService'

const app = createApp(App)

// Подключение Pinia
const pinia = createPinia()
app.use(pinia)

// Подключение Vue Router
app.use(router)

// Проверка: если нет счетов — перенаправить на визард
if (!localStorage.getItem(LocalStorageService.ACCOUNTS_KEY)) {
  router.push('/wizard')
}

// Подключение навигации
import Navigation from './components/common/Navigation.vue'
app.component('Navigation', Navigation)

// Инициализация аутентификации при старте
import { useAuthStore } from './stores/authStore'
const authStore = useAuthStore()
authStore.checkAuth()

// Инициализация данных
import { useAccountsStore } from './stores/accountsStore'
import { useTransactionsStore } from './stores/transactionsStore'
import { useCounterpartiesStore } from './stores/counterpartiesStore'

const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()
const counterpartiesStore = useCounterpartiesStore()

// Загрузка данных при старте
accountsStore.loadAccounts()
transactionsStore.loadTransactions()
counterpartiesStore.loadCounterparties()

app.mount('#app')
