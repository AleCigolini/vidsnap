import {createRouter, createWebHistory} from 'vue-router'
import {useAuth} from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'welcome',
      component: () => import('../views/BemVindoView.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/enviar-videos',
      name: 'enviar-videos',
      component: () => import('../views/EnviarVideosView.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/listar-videos',
      name: 'listar-videos',
      component: () => import('../views/ListarVideosView.vue'),
      meta: {requiresAuth: true},
    },
  ],
})

router.beforeEach((to, from, next) => {
  const {isAuthenticated} = useAuth()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated()) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated()) {
    next('/')
  } else {
    next()
  }
})

export default router
