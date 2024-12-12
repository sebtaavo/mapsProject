import { createRouter, createWebHashHistory } from 'vue-router';
import SidebarPresenter from '@/presenters/SidebarPresenter.vue';
import MapPresenter from './presenters/MapPresenter.vue';
import NavbarPresenter from './presenters/NavbarPresenter.vue';
import DetailsPresenter from './presenters/DetailsPresenter.vue';
import StartPresenter from './presenters/StartPresenter.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

export function VueRoot(props) {//this is a presenter.
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

  return (
    <div>
      {isAuthenticated.value ? (
        <>
          <NavbarPresenter class="navbar" />
          <div class="main-container">
            <div class="left-section">
              <MapPresenter />
            </div>
            <DetailsPresenter />
            <SidebarPresenter />
          </div>
        </>
      ) : (
        <StartPresenter />
      )}
    </div>
  );
}
