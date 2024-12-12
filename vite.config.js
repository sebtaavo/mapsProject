import { defineConfig } from 'vite';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';
import vuePlugin from '@vitejs/plugin-vue';
import path from 'path';
import { quasar } from '@quasar/vite-plugin'  // Import the Quasar Vite plugin

export default defineConfig({
    plugins: [
        vueJsxPlugin(),
        vuePlugin(),
        quasar(),
    ],
    server: {
        port: 8080,
    },
    build: {
        sourcemap: true,
        minify: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});
