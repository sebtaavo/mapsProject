import { defineConfig } from 'vite';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';
import vuePlugin from '@vitejs/plugin-vue';
import path from 'path'; // Import path module

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
        minify: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // Define '@' as an alias for 'src'
        },
    },
});
