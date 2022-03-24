import request from '../utils/request';
export const loginUser = query => {
    return request({
        url: '/Api/api/user/login',
        method: 'post',
        data: query
    });
};