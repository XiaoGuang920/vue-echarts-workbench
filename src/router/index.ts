import { createRouter, createWebHistory } from 'vue-router'
import Demo from '../views/DemoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Demo,
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo,
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/EditorView.vue'),
    },
    {
      path: '/previewer',
      name: 'previewer',
      component: () => import('../views/PreviewerView.vue'),
    },
    {
      path: '/migration',
      name: 'migration',
      component: () => import('../views/MigrationView.vue'),
    },
  ],
})

export default router
