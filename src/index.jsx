import './css/style.css';  // Adjust the path if needed based on your folder structure
import { createApp, h } from 'vue';
import { VueRoot } from './VueRoot.jsx';
import Vue3Geolocation from 'vue3-geolocation';

const app = createApp({
  render: () => h(VueRoot, { model: {} }),
});

app.use(Vue3Geolocation);
app.mount("#root");
