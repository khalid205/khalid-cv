import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // لا تقم بإضافة base هنا، اتركه محذوفاً
})