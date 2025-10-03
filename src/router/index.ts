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

router.beforeEach((to, from, next) => {
  const redirectPath = sessionStorage.getItem('redirect')

  if (redirectPath && to.path !== redirectPath && from.path !== redirectPath) {
    const targetRoute = router.resolve(redirectPath)
    if (targetRoute.matched.length > 0) {
      sessionStorage.removeItem('redirect')
      next(redirectPath)
      return
    } else {
      sessionStorage.removeItem('redirect')
    }
  }

  next()
})

export default router
