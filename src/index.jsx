import './css/style.css';
import { createApp, h } from 'vue';
import VueRoot from './VueRoot.jsx'; // Default export, no need for curly braces
import Vue3Geolocation from 'vue3-geolocation';
import './js/firebaseAuth.js';
import store from './js/store.js';
import router from './js/router.js'; // Import the router configuration

const app = createApp({
  render: () => h(VueRoot, { model: {} }),
});

app.use(Vue3Geolocation)
   .use(store)
   .use(router) // Use the router
   .mount("#root");
