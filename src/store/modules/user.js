import {createStore} from 'vuex'
import {getStore,setStore} from '@/utils/storage'
const userModules = {
    namespaced:true,
    state: {
        userInfo: JSON.parse(localStorage.getItem('userInfo') || "{}"),
        logged:false
    },
    mutations: {
        setUserInfo(state,data){
            
            state.userInfo = data
        },
        setLogged(state,data){
            state.logged = true
        }
    },
    actions: {
        setUserInfo(commit,args){
            localStorage.setItem('userInfo',JSON.stringify(args.data))
            setStore('userInfo', args.data);
            commit.commit('setUserInfo',args.data)
        },
        setLogged(commit,args){
            localStorage.setItem('storage_tokenList',args.tokenList)
            setStore('tokenList', args.tokenList);
            commit.commit('setLogged')
        }
    },
    modules: {}
}

export default userModules;