import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
function pathResolve(dir) {
  return resolve(__dirname, '.', dir);
}
import { defineConfig, loadEnv } from 'vite';
export default ({ mode }) => {
  console.log('123',loadEnv(mode, process.cwd()).VITE_APP_BASE_API);
  return defineConfig({
    base: './',
    plugins: [vue()],
    optimizeDeps: {
      include: ['schart.js'],
    },
    resolve: {
      alias: {
        '@': pathResolve('src'),
      },
    },
    server: {
      cors: true,
      open: false,
      proxy: {
        '/proxy': {
          // 记载本地配置
          target: loadEnv(mode, process.cwd()).VITE_APP_BASE_API, //代理接口
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy/, ''),
        },
      },
    },
  });
};
