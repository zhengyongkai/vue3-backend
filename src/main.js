import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import installElementPlus from './plugins/element';
import './assets/css/icon.css';
import 'nprogress/nprogress.css';
import * as dayjs from 'dayjs';
import * as Icons from '@element-plus/icons-vue';
import VueSocketIO from 'vue-socket-dev-kevin.io';


const socket = new VueSocketIO({
  debug: true,
  connection: 'http://127.0.0.1:7001',
});

const app = createApp(App);

app.config.globalProperties.$day=dayjs


Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]);
});
installElementPlus(app);

app.use(store).use(router).use(socket).mount('#app');
