var config = require('../../config');
var LZString = require('lz-string');
var exec = require('executive');
var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

const decodeBase64Image = require('./decodeBase64Image')
const mergeImages = require('./mergeImages')

var img_converted;
var result_path
var sequences_path
var uniqueSHA1String

/* ЗАПРОС НА ЭКСПОРТ ДАННЫХ */
router.all('/', function(req, res, next) {
    //console.log(req.body)
    // Определение технических параметров
    var path = config.back_export
    let sceneId = req.body.scene_id

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
        fs.mkdirSync(result_path)
        // Возвращаем уникальный ключ
        res.send({
            'unique_id': uniqueSHA1String
        });
    }
    // Сохранение изображений
    else {
        if (req.body.unique_id && req.body.count) {

            let frame = req.body.frame

            //получаем из чанка формат base64 и склеиваем его со всем остальным
            console.log(req.body.frame)
            img_converted = decodeBase64Image(req.body.chunk);
            //console.log(path + req.body.unique_id + '/' + req.body.frame + '.png');

            fs.writeFile(`${sequences_path}/${frame}.png`, img_converted.data)

            let base64String = mergeImages(`${config.back_scenes}${sceneId}/mockups/${frame}.png`,`${config.back_export}${uniqueSHA1String}/sequences/${frame}.png`)

            base64String
                .then(b64 =>
                    decodeBase64Image(b64)
                )
                .then(b64String =>
                    fs.writeFile(`${result_path}/${frame}.png`, b64String.data, function(err) {
                        if (err) {
                            return console.log(err);
                        }
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
                                    "ffmpeg -framerate 30 -i '" + path + req.body.unique_id + "/%d.png' -qmax 2 -vf alphaextract " + path + req.body.unique_id + "/out.mp4",
                                    "ffmpeg -framerate 30 -i '" + path + req.body.unique_id + "/%d.png' -i " + path + req.body.unique_id + "/out.mp4  -sws_dither bayer -qmax 2 -filter_complex vstack " + path + req.body.unique_id + "/stacked.mp4",
                                    "mv " + path + req.body.unique_id + "/stacked.mp4 " + path + req.body.unique_id + "/" + req.body.filename + ".mp4"
                                ]);
                            } else {
                                //	Генерация если альфамаска НЕ нужна
                                exec([
                                    "ffmpeg -framerate 30 -i '" + path + req.body.unique_id + "/%d.png'  -sws_dither bayer -qmax 2 " + path + req.body.unique_id + "/out.mp4",
                                    "mv " + path + req.body.unique_id + "/out.mp4 " + path + req.body.unique_id + "/" + req.body.filename + ".mp4"
                                ]);
                            }
                        }
                    })
                )

        } else if (req.body.unique_id) {
            console.log("CHECK: " + path + req.body.unique_id + "/" + req.body.filename + ".mp4");
            if (fs.existsSync(path + req.body.unique_id + "/" + req.body.filename + ".mp4")) {
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