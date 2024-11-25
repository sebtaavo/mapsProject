import { defineConfig } from 'vite';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';
import vuePlugin from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        vueJsxPlugin(),
       vuePlugin(),
    ],
    server: {
        port: 8080,
    },
    build: {
        sourcemap: true,
        minify: false
    }
});