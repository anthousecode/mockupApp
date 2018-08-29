var config = require("../config");
var express = require('express');
var router = express.Router();
var fs = require("fs");
var glob = require("glob");
var path = require("path");
const _ = require('lodash');
var async = require('async');
/* GET\POST для списка градиентов */
router.all('/', function(req, res, next) {
	// async.waterfall используется только из предположения о расширении функционала, а так внутри только одна функция
	async.waterfall([

function(callback) {
	// Получаем список всех файлов svg из папки
			glob(config.storage + "**/gradients/*.svg", {}, function(er, files) {
				var listoffiles = [];
				var i = files.length;
				while (i--) {
					// Тут читаем и парсим каждый их svg файлов для получения необходимых нам данных по градиенту
					var raw = fs.readFileSync(files[i]);
					// По умолчанию предполагаем что тип градиента radial
					var gradienttype = 'radial'
					// вынимаем данные из строк svg с помощью регулярок

					let regex = /stop-color[\"\=\s\:]+(.*?[)]*)[;\"]/g;
					let m;
					var color = [];
					while ((m = regex.exec(raw.toString())) !== null) {
						color.push(m[1]);
					}
					regex = /offset[\s\=\s\"]+(\d+)[%\"\s]+/g;
					var position = [];
					while ((m = regex.exec(raw.toString())) !== null) {
						position.push(m[1]);
					}
					regex = /stop-opacity[\"\=\s\:]+(\d[)]*)[;\"]/g;
					var opacity = [];
					while ((m = regex.exec(raw.toString())) !== null) {
						opacity.push(m[1]);
					}
					if (raw.toString().match(/linearGradient/gm)) gradienttype = 'linear'
			    // Формируем массив ключевых точек градиента с нужными нами данными 
					listoffiles.push({
						s_id: i,
						svg_data: {
							'color': color,   // Цвет
							'position': position,  // Позиция
							'opacity': opacity, // Прозрачность
							'type': gradienttype  // Тип градиента
						},
						s_file: path.relative(config.public_path, files[i])
					});
				}
				listoffiles.reverse();
				callback(null, listoffiles);
			});
}

], function(err, listoffiles) {
		res.send(listoffiles);
	});
});
module.exports = router;