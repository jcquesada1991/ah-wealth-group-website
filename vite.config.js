import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: './index.html',
                portal: './AH_Wealth_Portal.html'
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
})
