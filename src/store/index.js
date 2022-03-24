import {createStore} from 'vuex'
import {getStore,setStore} from '@/utils/storage'
export default createStore({
    state: {
        tagsList: [],
        collapse: false,
        userInfo: JSON.parse(localStorage.getItem('userInfo') || "{}"),
        logged:false
    },
    mutations: {
        delTagsItem(state, data) {
            state
                .tagsList
                .splice(data.index, 1);
        },
        setTagsItem(state, data) {
            state
                .tagsList
                .push(data)
        },
        clearTags(state) {
            state.tagsList = []
        },
        closeTagsOther(state, data) {
            state.tagsList = data;
        },
        closeCurrentTag(state, data) {
            for (let i = 0, len = state.tagsList.length; i < len; i++) {
                const item = state.tagsList[i];
                if (item.path === data.$route.fullPath) {
                    if (i < len - 1) {
                        data
                            .$router
                            .push(state.tagsList[i + 1].path);
                    } else if (i > 0) {
                        data
                            .$router
                            .push(state.tagsList[i - 1].path);
                    } else {
                        data
                            .$router
                            .push("/");
                    }
                    state
                        .tagsList
                        .splice(i, 1);
                    break;
                }
            }
        },
        // 侧边栏折叠
        handleCollapse(state, data) {
            state.collapse = data;
        },
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
})