import { createRouter, createWebHistory } from 'vue-router'
import dataServiceInstance from '../services/dataServiceInstance'
 
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresNav: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue')
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('../views/Accounts.vue')
  },
  {
    path: '/counterparties',
    name: 'Counterparties',
    component: () => import('../views/Counterparties.vue')
  },
  {
    path: '/chess-report',
    name: 'ChessReport',
    component: () => import('../views/ChessReport.vue')
  },
  {
    path: '/wizard',
    name: 'Wizard',
    component: () => import('../views/Wizard.vue'),
    meta: { requiresNav: false }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Навигационный охранник для защиты маршрутов
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await dataServiceInstance.isAuthenticated()

  // 1. Если не аутентифицирован
  if (!isAuthenticated) {
    // Если уже на /login — оставляем, не зацикливаемся
    if (to.name === 'Login') {
      next()
    } else {
      // Иначе — перенаправляем на /login
      next('/login')
    }
    return
  }

  // 2. Если аутентифицирован и пытается перейти на /login — решаем, куда дальше
  if (to.name === 'Login') {
    try {
      const accounts = await dataServiceInstance.getAccounts()
      if (Array.isArray(accounts) && accounts.length > 0) {
        next('/dashboard')
        return
      }
    } catch (e) {
      // При ошибке парсинга — считаем, что счетов нет
    }
    // Если счетов нет или ошибка — идём на визард
    next('/wizard')
    return
  }

  // 3. Если аутентифицирован и пытается перейти на /dashboard — проверяем, есть ли счета
  if (to.name === 'Dashboard') {
    try {
      const accounts = await dataServiceInstance.getAccounts()
      if (Array.isArray(accounts) && accounts.length > 0) {
        next()
        return
      }
    } catch (e) {
      // При ошибке — считаем, что счетов нет
    }
    // Если счетов нет или ошибка — перенаправляем на визард
    next('/wizard')
    return
  }

  // 4. Если аутентифицирован и на любой другой странице — разрешаем
  next()
})

export default router