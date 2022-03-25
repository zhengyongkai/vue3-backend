import request from '../utils/request';
export const uploadFile = query => {
    return request({
        url: '/api/upload/upload',
        method: 'post',
        data: query
    });
};