var config = require('../config');
var LZString = require('lz-string');
var exec = require('executive');
var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var img_converted;

function decodeBase64Image(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};
	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}
	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');
	return response;
}
/* ЗАПРОС НА ЭКСПОРТ ДАННЫХ */
router.all('/', function(req, res, next) {
	//console.log(req.body)
	// Определение технических параметров
	var path = config.path_export;
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
	// Сохранение изображений 
	else {
		if (req.body.unique_id && req.body.count) {
			console.log(req.body.frame)
			img_converted = decodeBase64Image(req.body.chunk);
			//console.log(path + req.body.unique_id + '/' + req.body.frame + '.png');
			fs.writeFile(path + req.body.unique_id + '/' + req.body.frame + '.png', img_converted.data, function(err) {
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