import './css/style.css';  // Adjust the path if needed based on your folder structure
import { createApp, h } from 'vue';
import { VueRoot } from './VueRoot.jsx';
import Vue3Geolocation from 'vue3-geolocation';
import './js/firebaseAuth.js';
import store from './js/store.js';

const app = createApp({
  render: () => h(VueRoot, { model: {} }),
});

app.use(Vue3Geolocation).use(store);
app.mount("#root");
