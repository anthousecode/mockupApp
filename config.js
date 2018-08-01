/* Конфигурация приложения */

//const path = '/home/user/Projects/mockupApp'
const path = '/home/alex-pc/MockUp/mockupApp/'
var config = {

    port : 8080,
    path : `${path}/public/scenes/`,
    storage : `${path}/public/store/`,
    public_path : `${path}/public`,
    path_export: `${path}/public/export/`,
    back_export: `${path}/routes/mergeImages/session/`,
    back_scenes: `${path}/routes/ads/scenes/`,
    relpath : '/scenes/',

};

module.exports = config;
