import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "node:path"
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./dist",
    target: "es2015",
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.js'),
      fileName: 'CanvasShowCase',
      name:'CanvasShowCase',
      formats: ['cjs', 'umd', 'es'],
    },
  },
  plugins: [vue()],
})
