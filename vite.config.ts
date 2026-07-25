import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/khalid-cv/', // مهم جداً أن يكون هكذا وليس './' ليتطابق مع اسم المستودع تماماً
  build: {
    chunkSizeWarningLimit: 1000,
  }
})