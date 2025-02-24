import { createRouter, createWebHistory } from 'vue-router'
import SearchCharacter from '../components/SearchCharacter.vue'
import Profile from '../components/CharacterProfile.vue'

const routes = [
  {
    path: '/',
    name: 'SearchCharacter',
    component: SearchCharacter
  },
  {
    path: '/profile',
    name: 'CharacterProfile',
    component: Profile,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (localStorage.getItem('authenticated') !== 'true') {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
