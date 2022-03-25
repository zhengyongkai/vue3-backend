import request from '../utils/request';

export const loginUser = query => {
    return request({
        url: '/api/user/login',
        method: 'post',
        data: query
    });
};
export const getUserInfo = query => {
    return request({
        url: '/api/user/get_userinfo',
        method: 'get',
        params: query
    });
};

