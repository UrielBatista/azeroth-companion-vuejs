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
    meta: { requiresParams: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresParams) {
    const query = to.query;
    if (!query.name || !query.realm) {
      alert("You must search for a character before accessing the profile.");
      next('/');
      return;
    }
  }
  next();
});

export default router
