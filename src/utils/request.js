import axios from "axios";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import qs from 'qs'
import {getParamsNotNull} from '@/utils/utils'
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('storage_tokenList');
    if (config.method === "post") {
      config.headers = {
        "content-type": "application/json",
      };
    }
    if(config.method === 'get'){
      console.log(getParamsNotNull(config.params))
      config.params = getParamsNotNull(config.params)
    }
    if(config.url.indexOf('login') == -1){
        if (token) {
            config.headers['authorization'] = `${token}`;
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response) => {
    const router = useRouter();
    if (response.status === 200) {
      if (response.data.code === 200) {
        return response.data;
      } else {
        if (response.data.code === 401) {
        //   router.replace("/login");
        }
        ElNotification({
          message: response.data.msg,
          type: "error",
        });
        return Promise.reject();
      }
     
    } else {
      Promise.reject();
    }
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

export default service;
