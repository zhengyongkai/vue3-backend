import request from '../utils/request';

export const getMenu = query => {
    return request({
        url: '/api/menus/role/query',
        method: 'get',
        params: query
    });
};

export const saveMenu = query => {
    return request({
        url: '/api/menus/role/save',
        method: 'post',
        data: query
    });
};



export const deleteMenu = query => {
    return request({
        url: '/api/menus/role/delete',
        method: 'post',
        data: query
    });
};