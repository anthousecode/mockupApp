/* Конфигурация приложения */

const path = '/home/user/Projects/mockupApp'

var config = {

    port : 8080,
    path : `${path}/public/scenes/`,
    storage : `${path}/public/store/`,
    public_path : `${path}/public`,
    path_export: `${path}/public/export/`,
    relpath : '/scenes/',

};

module.exports = config;
