import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 53345,
        proxy: {
            '/api': {
                target: 'https://localhost:7023',
                changeOrigin: true,
                secure: false
            }
        }
    }
})
