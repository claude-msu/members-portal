import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '/supabase',
        // Generated / external: not our code to cover
        'src/integrations/**',
        // UI primitives (shadcn): low ROI to test; we test behavior in app code
        'src/components/ui/**',
        // Modals: form validation tested but full coverage (dates, submit) is integration-level
        'src/components/modals/**',
        // Entry and app shell: minimal logic
        'src/main.tsx',
        'src/App.tsx',
        'src/App.css',
        'src/index.css',
        'src/vite-env.d.ts',
        // Contexts: auth/profile/theme; typically covered via integration/E2E, not unit
        'src/contexts/**',
        // Page routes: feature-heavy; validation/logic tested in lib + Auth tests; full flows via E2E
        'src/pages/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});