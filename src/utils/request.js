import axios from 'axios';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
// import qs from 'qs';
import { getParamsNotNull } from '@/utils/utils';
const service = axios.create({
  // process.env.NODE_ENV === 'development'
  baseURL: import.meta.env.VITE_APP_BASE_PROXY,
  timeout: 5000,
});
service.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('storage_tokenList');
    if (config.method === 'post' && !config.file) {
      config.headers = {
        'content-type': 'application/json',
      };
    }
    if (config.file) {
      config.headers = {
        'content-type': 'multipart/form-data',
      };
    }
    if (config.method === 'get') {
      config.params = getParamsNotNull(config.params);
    }
    if (config.url.indexOf('login') == -1) {
      if (token) {
        config.headers['authorization'] = `${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  ({ status, data }) => {
    if (status === 200) {
      if (data.code === 200) {
        return data;
      }
      if (data.code === 401) {
        location.href = '/#/login';
      }
      if (data.code === 500) {
        return ElNotification({
          message: data.msg,
          type: 'error',
        });
      }
      return Promise.reject(data);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
