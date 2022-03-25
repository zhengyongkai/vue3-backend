import request from '../utils/request';
export const getNews = query => {
    return request({
        url: '/api/news/list',
        method: 'get',
        params: query
    });
};
export const saveNews = query => {
    return request({
        url: '/api/news/saveNews',
        method: 'post',
        data: query
    });
};
export const publishNews = query => {
    return request({
        url: '/api/news/publichNews',
        method: 'post',
        data: query
    });
};
export const deleteNews = query => {
    return request({
        url: '/api/news/delete',
        method: 'post',
        data: query
    });
};