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
const env = 'development'
const api = env === 'development' ? '/Api' : 'http://134.175.103.137:7001'
service.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('storage_tokenList');
    config.url = api + config.url 
    if (config.method === "post" && !config.file ) {
      config.headers = {
        "content-type": "application/json",
      };
    }
    console.log(config)
    if(config.file){
      config.headers = {
        "content-type": "multipart/form-data",
      };
    }
    if(config.method === 'get'){
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
    if (response.status === 200) {
      if (response.data.code === 200) {
        return response.data;
      } else {
        if (response.data.code === 401) {
             location.href='/#/login'
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
