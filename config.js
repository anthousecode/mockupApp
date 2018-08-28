/* Конфигурация приложения */

//const path = '/home/user/Projects/mockupApp'
const path = '/media/alex-pc/92DC61D1DC61B061/MockApp/mockupApp'
var config = {
    port : 8080,
    path : `${path}/public/scenes/`,
    storage : `${path}/public/store/`,
    public_path : `${path}/public`,
    path_export: `${path}/public/export/`,
    back_export: `${path}/routes/exportVideo/sessions/`,
    back_scenes: `${path}/routes`,
    relpath : '/scenes/',

};

module.exports = config;
