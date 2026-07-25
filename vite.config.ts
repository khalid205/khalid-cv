import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './khalid-cv', // اجعلها نقطة وشرطة مائلة هكذا لتكون المسارات نسبية وتعمل في أي مسار فرعي
  build: {
    chunkSizeWarningLimit: 1000,
  }
})