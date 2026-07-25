import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/khalid-cv/', // يجب أن يكون مطابقاً لاسم المستودع تماماً وبينهما شرطات مائلة
})