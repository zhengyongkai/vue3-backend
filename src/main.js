import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import installElementPlus from './plugins/element';
import './assets/css/icon.css';
import 'nprogress/nprogress.css';
import WebsocketClass from './utils/websocket/transport/websocket';
import * as Icons from '@element-plus/icons-vue';

const app = createApp(App);
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]);
});

const socket = new WebsocketClass(
  'ws://127.0.0.1:7001/chat/' +
    JSON.parse(localStorage.getItem('userInfo') || '{}').userid || '',
  {
    protocol: [],
    reconnection: true,
    store,
    storeNamespace: 'user',
  }
);

app.config.globalProperties.$socket = socket;

installElementPlus(app);
app.use(store).use(router).mount('#app');
