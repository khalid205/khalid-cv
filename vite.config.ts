import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/khalid-cv/', // هذا السطر هو كلمة السر لظهور التصميم في GitHub Pages
})