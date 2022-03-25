import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
import * as Icons from '@element-plus/icons-vue'

const app = createApp(App)
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')