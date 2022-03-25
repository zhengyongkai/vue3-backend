import request from '../utils/request';
export const getType = query => {
    return request({
        url: '/api/type/list',
        method: 'get',
        params: query
    });
};
export const saveType = query => {
    return request({
        url: '/api/type/save',
        method: 'post',
        data: query
    });
};
export const deleteType = query => {
    return request({
        url: '/api/type/delete',
        method: 'post',
        data: query
    });
};