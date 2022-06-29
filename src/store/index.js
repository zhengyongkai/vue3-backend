import {createStore} from 'vuex'
import user from './modules/user'
import base from './modules/base'


const store = createStore({
  modules: {
    user:user,
    base:base
  }
})

export default store
