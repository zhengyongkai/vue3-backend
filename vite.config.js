import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}
import { defineConfig } from "vite";
export default ({ mode }) => {
  const env = mode === 'development' ? 'http://localhost:7002' : ''
  return defineConfig({
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
        "/Api": {
          target: env, //代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/Api/, ""),
        },
      },
    },
  });
};
