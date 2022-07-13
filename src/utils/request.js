import axios from 'axios';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import qs from 'qs';
import { getParamsNotNull } from '@/utils/utils';
const service = axios.create({
  // process.env.NODE_ENV === 'development'
  timeout: 5000,
});
const env = 'development';
const api = env === 'development' ? '/Api' : '';
service.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('storage_tokenList');
    config.url = api + config.url;
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
    return Promise.reject();
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
      return Promise.reject();
    }
  },
  (error) => {
    return Promise.reject();
  }
);

export default service;
