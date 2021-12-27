import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: './demo',

  plugins: [
    vue(),
  ],

  resolve: {
    extensions: ['.vue', '.js', '.json', '.less']
  },

  build: {
    outDir: './build',

    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  },

  server: {
    port: process.env['VITE_SERVER_PORT'] || 8000
  }
});
