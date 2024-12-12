import { defineComponent } from 'vue';
import { RouterView } from 'vue-router'; // Import RouterView
import { useStore } from 'vuex';

export default defineComponent({//we can only do this and incorporate a "template" in a jsx define component if we have the build on runtime setting in vite config
  name: 'VueRoot',
  setup() {
    const store = useStore();
    return { isAuthenticated: store.getters.isAuthenticated };
  },
  template: `
    <div>
      <RouterView /> <!-- Dynamically render components based on the route -->
    </div>
  `,
});
