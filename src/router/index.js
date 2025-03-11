import { createRouter, createWebHistory } from 'vue-router'
import SearchCharacterPT from '@/pages/portuguese/SearchCharacter.vue'
import SearchCharacter from '@/pages/english/SearchCharacter.vue'
import ProfilePT from '@/pages/portuguese/CharacterProfile.vue'
import Profile from '../pages/english/CharacterProfile.vue'

const routes = [
  {
    path: '/en-us',
    name: 'SearchCharacter',
    component: SearchCharacter
  },
  {
    path: '/en-us/profile',
    name: 'CharacterProfile',
    component: Profile,
    meta: { requiresParams: true },
  },
  {
    path: '/pt-br',
    name: 'SearchCharacterPT',
    component: SearchCharacterPT
  },
  {
    path: '/pt-br/profile',
    name: 'CharacterProfilePT',
    component: ProfilePT,
    meta: { requiresParams: true },
  }
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
