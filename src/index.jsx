import {createApp, h} from "vue";
import {VueRoot} from "./VueRoot.jsx";
import Vue3Geolocation from 'vue3-geolocation'; //npm install vue3-geolocation

const app = createApp({
    render: () => h(VueRoot, { model: {} }),
  });


app.use(Vue3Geolocation);
app.mount("#root");