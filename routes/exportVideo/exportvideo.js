var config = require('../../config');
var LZString = require('lz-string');
var exec = require('executive');
var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var Caman = require('caman').Caman;
var LZUTF8 = require('lzutf8');

/*const PIXI = require('pixi-shim')
const filters = require('pixi-filters')*/

const decodeBase64Image = require('./decodeBase64Image')
const mergeImages = require('./mergeImages')
const makeStringForMerge = require('./makePathStringForMerge')


var result_path
var sequences_path
var output_path

var uniqueSHA1String
var img_converted;

var scene_backgroundBase64
var background_gradientBase64
var filter

var stringPathToMockups = []


//var subrenderer_client


/* ЗАПРОС НА ЭКСПОРТ ДАННЫХ */
router.all('/', function(req, res, next) {

    // Определение технических параметров
    var path = config.back_export
    let sceneId = req.body.scene_id

    if (req.body.scene_background && req.body.background_gradient) {
        scene_backgroundBase64 = req.body.scene_background
        background_gradientBase64 = req.body.background_gradient
        filter = req.body.filters
    }

    // Начало передачи изображений
    if (req.body.stream == 'start') {

        var seed = crypto.randomBytes(20);
        uniqueSHA1String = crypto.createHash('sha1').update(seed).digest('hex');
        console.log('HASH: ' + path + uniqueSHA1String);

        // Создаем папку сессии для сиквенсов
        fs.mkdirSync(path + uniqueSHA1String);
        sequences_path =`${path}${uniqueSHA1String}/sequences`
        fs.mkdirSync(sequences_path);

        //создание папки где будут склеянный результат
        result_path = `${path}/${uniqueSHA1String}/result`
        output_path =`${path}/${uniqueSHA1String}/output`

        fs.mkdirSync(result_path)
        fs.mkdirSync(output_path)
        // Возвращаем уникальный ключ
        res.send({
            'unique_id': uniqueSHA1String
        });
    }
    // Сохранение изображений
    else {
        if (req.body.unique_id && req.body.count) {



            let sequences = req.body.chunk
            let frame = req.body.frame
            let width = req.body.width
            let height = req.body.height

            // for(let i = 0; i < req.body.chunk.length; i++){
            //   let	outputArr = Object.values(sequences[i]);
            //   let uint8 = new Uint8Array(outputArr);
            //   let output = LZUTF8.decompress(uint8);
            //   sequences.push(output);
            // }
            //console.log(sequences);


            stringPathToMockups = makeStringForMerge(`${config.back_scenes}${sceneId}`, sequences, frame, width, height, scene_backgroundBase64, background_gradientBase64)

            //получаем из чанка формат base64 и склеиваем его со всем остальным
            console.log(frame)
            //img_converted = decodeBase64Image(req.body.chunk);

            let base64String = mergeImages(stringPathToMockups)

            base64String
                .then(b64 => {

                    /*subrenderer_client = new PIXI.Application({
                        width: req.body.width,
                        height: req.body.height,
                        transparent: true,
                        resolution: 1,
                        antialias: true,
                        powerPreference: "high-performance"
                    });

                    subrenderer_client.renderer.width = req.body.width;
                    subrenderer_client.renderer.height = req.body.height;

                    var texture = new PIXI.Texture.fromImage(b64);

                    var sprite = new PIXI.Sprite(texture);

                    var ff = new filters.AdjustmentFilter({
                        gamma: filter.gamma,
                        contrast: filter.contrast,
                        saturation: filter.saturation,
                        brightness: filter.brightness,
                    })
                    //sprite.filters = [ff];

                    var base64 = subrenderer_client.renderer.extract.base64(sprite)*/

                        return decodeBase64Image(b64)
                    }
                )
                .then(b64String =>
                    fs.writeFile(`${result_path}/${frame}.png`, b64String.data, function(err) {
                        if (err) {
                            return console.log(err);
                        }

                       /* Caman(b64String.data, function () {
                            //console.log(filters)
                            this.contrast(filters.contrast)
                            //this.exposure(filters.exposure)
                            this.saturation(filters.saturation)
                            this.brightness(filters.brightness);
                            this.render(function () {
                                this.save(`${output_path}/${frame}.png`);
                            });
                        })*/

                        res.send({
                            'status': 'file_created'
                        });
                        // Если файл последний - запускаем конвертирование файла в видео
                        if ((req.body.count) == fs.readdirSync(path + req.body.unique_id + '/').length) {
                            /*

                            Команды для типового экспорта без альфы
                            "ffmpeg -framerate 30 -i '"+path+req.body.unique_id+"/%d.png' -qmax 2 "+path+req.body.unique_id+"/out.mp4",
                            "mv "+path+req.body.unique_id+"/out.mp4 "+path+req.body.unique_id+"/"+req.body.filename+".mp4"

                            Команда на получение маски
                            ffmpeg -framerate 30 -i "%d.png" -qmax 2 -vf alphaextract out.mp4

                            Команда на склеивание двух видео вертикально
                            ffmpeg -framerate 30 -i "%d.png" -i out.mp4 -qmax 2 -filter_complex vstack stacked.mp4
                            */
                            // Генерация если альфамаска нужна
                            if (req.body.renderalpha) {
                                exec([
                                    "ffmpeg -framerate 30 -i '" + result_path + "/%d.png' -qmax 2 -vf alphaextract " + result_path + "/out.mp4",
                                    "ffmpeg -framerate 30 -i '" + result_path + "/%d.png' -i " + result_path + "/out.mp4  -sws_dither bayer -qmax 2 -filter_complex vstack " + result_path + "/stacked.mp4",
                                    "mv " + result_path + "/stacked.mp4 " + result_path + "/" + req.body.filename + ".mp4"
                                ]);
                            } else {
                                //	Генерация если альфамаска НЕ нужна
                                exec([
                                    "ffmpeg -framerate 30 -i '" + path + req.body.unique_id + "/%d.png'  -sws_dither bayer -qmax 2 " + path + req.body.unique_id + "/out.mp4",
                                    "mv " + result_path + "/out.mp4 " + result_path + "/" + req.body.filename + ".mp4"
                                ]);
                            }
                        }
                    })
                )

        } else if (req.body.unique_id) {
            console.log("CHECK: " + result_path + "/" + req.body.filename + ".mp4");
            if (fs.existsSync(result_path + "/" + req.body.filename + ".mp4")) {
                res.send({
                    'status': 'success'  // Сигнал если все готово
                });
            } else res.send({
                'status': 'not_yet'    // Сигнал если еще не готово
            });
        } else res.send({
            'error': 'no_unique_id'  // Ошибка если сессия генерации начата не верно (у нас нет ID сессии)
        });
    }
});
module.exports = router;
