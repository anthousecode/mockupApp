var express = require('express');
var router = express.Router();
var fs = require("fs");
var glob = require("glob");
var config = require("../config");
const path = require('path');
const _ = require('lodash');
var async = require('async');
var sizeOf = require('image-size');
router.all('/', function(req, res, next) {
    async.waterfall([
        // Получаем список всех превьюшек
        function(callback) {
            var previews = [];
            glob(config.path + "**/preview/*.jpg", {}, function(er, files) {
                var i = files.length;
                while (i--) {
                    previews.push({
                        s_id: path.dirname(path.relative(config.path, path.dirname(files[i]))),
                        s_file: config.relpath + path.relative(config.path, files[i])
                    });
                }
                previews.reverse();
                callback(null, previews);
            });
        },
// Перегрупируем их по папкам
        function(sequencefiles, callback) {
            callback(null, _.groupBy(sequencefiles, function(u) {
                return u.s_id
            }));
        },
// Получаем список всех настроек всех сцен
        function(sequencefiles, callback) {
            glob(config.path + "**/settings", {}, function(er, files) {
                callback(null, files, sequencefiles)
            });
        },
// Получаем список всех настроек всех слоев  у всех сцен
        function(settingsfiles, sequencefiles, callback) {
            glob(config.path + "**/layer_settings", {}, function(er, files) {
                callback(null, settingsfiles, sequencefiles, files)
            });
        },
// Получаем список всех изображений кадров у всех сцен
        function(settingsfiles, sequencefiles, layer_settings, callback) {
            var i = layer_settings.length;
            var scene_frames = [];
            while (i--) {
                var scene_id = path.dirname(path.relative(config.path, path.dirname(layer_settings[i])));
                scene_frames[scene_id] = glob.sync(path.dirname(layer_settings[i]) + '/device/*.png').length;
            }
            callback(null, settingsfiles, sequencefiles, layer_settings, scene_frames)
        },
// Переформируем все данные в json массив объектов по каждой сцене
        function(settingsfiles, sequencefiles, layer_settings, scene_frames, callback) {
            var sceneconfig = [];
            _.transform(settingsfiles, function(result, value, key) {
                var preview_collection = _.map(sequencefiles[path.relative(config.path, path.dirname(value))], function(i) {
                    return i.s_file
                });

                var settingsdata = JSON.parse(fs.readFileSync(value).toString())

                if(typeof(settingsdata.padwidth) == 'undefined' || typeof(settingsdata.padheight) == 'undefined'){
                    var dimensions = sizeOf(path.dirname(config.path) + '/' + preview_collection[0]);
                }

                var scene_id = path.relative(config.path, path.dirname(value))
                result.push({
                    s_id: scene_id,
                    s_name: settingsdata.name,
                    s_uri_poster: preview_collection[0],
                    s_uri_preview: preview_collection,
                    s_uri_preiew_width: (typeof(settingsdata.padwidth) == 'undefined') ? dimensions.width : settingsdata.padwidth,
                    s_uri_preiew_height: (typeof(settingsdata.padheight) == 'undefined') ? dimensions.height : settingsdata.padheight,
                    s_looped: (typeof(settingsdata.loop) == 'undefined') ? false : settingsdata.loop,
                    s_frames: scene_frames[scene_id],
                    s_padtitle : (typeof(settingsdata.padtitle) == 'undefined') ? '' : settingsdata.padtitle,
                    s_padlink : (typeof(settingsdata.padlink) == 'undefined') ? '' : settingsdata.padlink,
                    s_padlinktext:  (typeof(settingsdata.padlinktext) == 'undefined') ? '' : settingsdata.padlinktext
                })
            }, sceneconfig);
            callback(null, sceneconfig);
        }
    ], function(err, result) {
        res.send(result);
    });
    //data = fs.readFileSync(path+'/preview/'+previews[l]);
    //previews[l] = 'data:image/png;base64,'+Buffer.from(data).toString('base64');
});
module.exports = router;