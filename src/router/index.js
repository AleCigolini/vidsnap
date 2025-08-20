import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('../views/BemVindoView.vue'),
    },
    {
      path: '/enviar-videos',
      name: 'enviar-videos',
      component: () => import('../views/EnviarVideosView.vue'),
    },
    {
      path: '/listar-videos',
      name: 'listar-videos',
      component: () => import('../views/ListarVideosView.vue'),
    },
  ],
})

export default router
