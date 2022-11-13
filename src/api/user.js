import request from '../utils/request';
export const getUserList = (query) => {
  return request({
    url: '/api/user/list',
    method: 'get',
    params: query,
  });
};
