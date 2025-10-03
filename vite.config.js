import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    css: {
        postcss: './postcss.config.cjs',
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        hmr: {
            host: '127.0.0.1',
            port: 5173,
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: process.env.VITE_DEV_SERVER_HOST || '0.0.0.0',
        port: parseInt(process.env.VITE_DEV_SERVER_PORT) || 5173,
        hmr: {
            host: 'localhost',
            port: parseInt(process.env.VITE_DEV_SERVER_PORT) || 5173,
        },
    },
});
