import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Safely stringify the API key for usage in client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill process.env as an empty object to prevent "process is not defined" errors
      'process.env': {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'icons': ['lucide-react'],
            'ai': ['@google/genai']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  };
});