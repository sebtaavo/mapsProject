import { createRouter, createWebHashHistory } from 'vue-router';
import SidebarPresenter from '@/presenters/SidebarPresenter.vue';
import MapPresenter from '@/presenters/MapPresenter.vue';
import NavbarPresenter from '@/presenters/NavbarPresenter.vue';
import DetailsPresenter from '@/presenters/DetailsPresenter.vue';
import StartPresenter from '@/presenters/StartPresenter.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const routes = [
  {
    path: '/main',
    component: StartPresenter,
  },
  {
    path: '/map',
    component: {
      template: `
        <div>
          <NavbarPresenter class="navbar" />
          <div class="main-container">
            <div class="left-section">
              <MapPresenter />
            </div>
            <DetailsPresenter />
            <SidebarPresenter />
          </div>
        </div>
      `,
      components: {
        NavbarPresenter,
        MapPresenter,
        SidebarPresenter,
        DetailsPresenter,
      },
    },
    meta: { requiresAuth: true }, //requires authentication
  },
  { path: '/:pathMatch(.*)*', redirect: '/main' }, //we redirect unknown routes to /main
];

const router = createRouter({
  history: createWebHashHistory(), //from the labs
  routes,
});

//navig guard to check authentication
const store = useStore();
router.beforeEach((to, from, next) => {
  const isAuthenticated = computed(() => store.getters.isAuthenticated);

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/main'); //we have to redirect to main page if not authenticated
    } else {
      next(); // but allow navigation if authenticated
    }
  } else {
    next(); //not sure what this does but i think its necessary, doesnt work without it
  }
});

export default router;