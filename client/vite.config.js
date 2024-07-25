import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  server : {
       proxy : {
        '/api':{
          target : "https://mern-blog-refined.vercel.app/" ,
                secure : false
        }
       }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
