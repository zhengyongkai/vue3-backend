import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
function pathResolve(dir) {
    return resolve(__dirname, ".", dir);
}
export default {
  base: "./",
  plugins: [vue()],
  optimizeDeps: {
    include: ["schart.js"],
  },
  resolve: {
    alias: {
      "@": pathResolve("src"),
    },
  },
  server: {
    cors: true,
    open: true,
    proxy: {
      '/Api': {
          target: 'http://localhost:7001',   //代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/Api/, '')
      }
    }
}
};
