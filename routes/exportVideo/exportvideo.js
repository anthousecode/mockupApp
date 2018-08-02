var config = require('../../config');
var LZString = require('lz-string');
var exec = require('executive');
var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var router = express.Router();

const decodeBase64Image = require('./decodeBase64Image')
const mergeImages = require('./mergeImages')

let img_converted

/* ЗАПРОС НА ЭКСПОРТ ДАННЫХ */
router.all('/', function(req, res, next) {
	//console.log(req.body)
	// Определение технических параметров
	var path = config.back_export
	// Начало передачи изображений 
	if (req.body.stream == 'start') {
		// Генерируем случайный ID
		var seed = crypto.randomBytes(20);
		var uniqueSHA1String = crypto.createHash('sha1').update(seed).digest('hex');
		console.log('HASH: ' + path + uniqueSHA1String);
		// Создаем папку для экспорта данных
		fs.mkdirSync(path + uniqueSHA1String);
		// Возвращаем уникальный ключ	
		res.send({
			'unique_id': uniqueSHA1String
		});
	}
	// Сохранение сиквенсов
	else {
		if (req.body.unique_id && req.body.count) {
			console.log(req.body.frame)
			img_converted = decodeBase64Image(req.body.chunk);
			//console.log(path + req.body.unique_id + '/' + req.body.frame + '.png');
			fs.writeFile(`${path}/${req.body.unique_id}/sequences${req.body.frame }.png`, img_converted.data, function(err) {
				if (err) {
					return console.log(err);
				}
				res.send({
					'status': 'file_created'
				});
				// Если файл последний - запускаем склеивание мокапов и сиквенсов
				if ((req.body.count) == fs.readdirSync(path + req.body.unique_id + '/').length) {
                    const mockupsFolder = `${config.back_scenes}/${sceneId}`
                    const mockupsArr = fs.readdirSync(`${mockupsFolder}/mockups`)
					const sequencesArr = fs.readdirSync(`${path}/${req.body.unique_id}/sequences/`)

					const result_path = `${path}/${req.body.unique_id}/result`
					fs.mkdirSync(result_path)

                    let image_convert

                    for(let i = 0; i < req.body.count; i++) {

                        let dataImgString = mergeImages(`../ads/scenes/${sceneId}/mockups/${mockupsArr[i]}`,`../session/${uniqueSHA1String}/sequences/${sequencesArr[i]}`)
                        image_convert = decodeBase64Image(dataImgString)

                        fs.writeFile(`${result_path}/${i}.png`, image_convert.data, function(err) {
                            if (err) {
                                return console.log(err);
                            }

                            if((req.body.count) == fs.readdirSync(`${path}/${req.body.unique_id}/result/`).length) {

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
                    } // сюда элсы

				}
			});
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