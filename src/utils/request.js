import axios from 'axios';
import { ElNotification } from 'element-plus';
// import { useRouter } from 'vue-router';
// import qs from 'qs';
import { getParamsNotNull } from '@/utils/utils';
import nProgress from 'nprogress';

const service = axios.create({
  // process.env.NODE_ENV === 'development'
  baseURL: import.meta.env.VITE_APP_BASE_PROXY,
  timeout: 5000,
});
// 状态参照表
const statusMap = {};
service.interceptors.request.use(
  (config) => {
    nProgress.start();
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
    nProgress.done();
    if (status === 200) {
      if (data.code === 200) {
        return data;
      }

      return Promise.reject(data);
    }
  },
  ({ response }) => {
    console.log(response)
    nProgress.done();
    if (!response) {
      return Promise.reject(response);
    }
    if (response.status === 401 || response.status === 403) {
      location.href = '/#/login';
    }
    ElNotification({
      message: response.data.msg,
      type: 'error',
    });

    return Promise.reject(response);
  }
);

export default service;
