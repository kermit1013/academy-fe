import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: '', // 设置为空字符串，可以使资源保持在 dist 目录的根级别
    rollupOptions: {
      output: {
        // 防止文件名哈希
        assetFileNames: (assetInfo) => {
          // 如果想针对不同类型的文件保持原始名称，可以添加更多的条件
          if (assetInfo.name.indexOf('.svg') > -1) {
            return 'assets/[name][extname]'
          }
          // 其他文件类型保留原有的哈希策略
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
