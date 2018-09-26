var config = require("../config");
var express = require('express');
var router = express.Router();
var fs = require("fs");
var glob = require("glob");
var _path = require("path");
var sizeOf = require('image-size');

/* GET users listing. */
router.all('/:id', function (req, res, next) {

	// Путь к сцене
	var path = config.path + req.params.id;

	// Проверяем существует ли такая сцена
	if (fs.existsSync(path)) {

		// Получаем файл настроек
		var id = req.params.id;
		var settings = fs.readFileSync(path + '/settings');

		// Проверяем валидность JSON
		try {
			settings = JSON.parse(settings);
		} catch (e) {
			res.send({
				"status": "error",
				"descr": "not_valid_json_in_settings"
			});
			return;
			exit;
		}

		// Получаем массив превью
		var previews
		if(settings.animated) {
            previews = fs.readdirSync(path + '/preview');
            for (var l = 0; l < previews.length; l++) {
                previews[l] = '/scenes/' + id + '/preview/' + previews[l];
            }
		}else previews = fs.readdirSync(path + '/preview')





		// Считаем слои
		var layers = glob.sync(path + "/**/layer_settings");
		var x = layers.length;
		while (x--) {
			_path.dirname(layers[x]);
		}

		// Считаем кадры
		if (layers.length == 0) {
			res.send({
				"status": "error",
				"descr": "no_mockups_or_frames_found"
			});
		} else {

			var frames;

			// Формируем слои
			var l_id_path;
			var l_id_arr;
			var l_id;
			var l_name;

			// Массив данных о слоях
			var s_layers = [];
			var l_data = [];

			// Координаты
			var LowerLeft;
			var LowerRight;
			var UpperLeft;
			var UpperRight;
			var Offset;
			var Device;
			var Mask;
			var Frames_arr = [];

			var i_mask_uri = '';
			var i_img_uri = '';
			var i_device_uri = '';
			var i_upperright = '';
			var i_upperleft = '';
			var i_lowerright = '';
			var i_lowerleft = '';
			var i_offset = '';
			var data;
			var num;
			var i_icon_uri;

			var staticImages

			for (var k = 0; k < layers.length; k++) {

				// Получаем путь и ID
				l_id_path = _path.dirname(layers[k]);
				l_id_arr = l_id_path.split('/');
				l_id = _path.basename(_path.relative(path, _path.dirname(layers[k])));

				// Получаем название
				l_name = fs.readFileSync(layers[k]).toString();
				l_name = (JSON.parse(l_name)).name;



				// Получаем коодинаты

				if(settings.animated) {
                    LowerLeft = fs.readFileSync(l_id_path + '/coordinates/LowerLeft').toString().replace(/\r/g, "\n").split("\n");
                    LowerRight = fs.readFileSync(l_id_path + '/coordinates/LowerRight').toString().replace(/\r/g, "\n").split("\n");
                    UpperLeft = fs.readFileSync(l_id_path + '/coordinates/UpperLeft').toString().replace(/\r/g, "\n").split("\n");
                    UpperRight = fs.readFileSync(l_id_path + '/coordinates/UpperRight').toString().replace(/\r/g, "\n").split("\n");
                    Offset = fs.readFileSync(l_id_path + '/coordinates/Offset').toString().replace(/\r/g, "\n").split("\n");
				}else {
                    var setup = fs.readFileSync(`${path}/${l_id}/Setup.json`);
                    setup = JSON.parse(setup)
				}
				Crop = [
'518	102',
'1324.6	102',
'1324.6	990',
'518	990'

				]//fs.readFileSync(l_id_path + '/coordinates/SelectBox').toString().replace(/\r/g, "\n").split("\n");

				if(settings.animated) {
                    Device = glob.sync(l_id_path + '/device/*.png');
				}else {
                    Device = glob.sync(l_id_path + '/devices/*/*.png');
				}

				var temp_case;

				l_crop = [];
				var crop_length = Crop.length;
				for (var v = 0; v < crop_length; v++) {
					temp_case = Crop[v].trim();
					temp_case = temp_case.split("\t");

					l_crop.push({
						x: temp_case[0],
						y: temp_case[1]
					})

				}

				xy_arr = {
					LowerLeft: {},
					LowerRight: {},
					UpperLeft: {},
					UpperRight: {},
					Offset: {}
				};

				if(settings.animated) {
                    var ll_length = LowerLeft.length;

                    for (var v = 0; v < ll_length; v++) {

                        temp_case = LowerLeft[v].trim();
                        temp_case = temp_case.split("\t");
                        xy_arr.LowerLeft[temp_case[0]] = {
                            'x': temp_case[1],
                            'y': temp_case[2]
                        };

                        temp_case = LowerRight[v].trim();
                        temp_case = temp_case.split("\t");
                        xy_arr.LowerRight[temp_case[0]] = {
                            'x': temp_case[1],
                            'y': temp_case[2]
                        };

                        temp_case = UpperLeft[v].trim();
                        temp_case = temp_case.split("\t");
                        xy_arr.UpperLeft[temp_case[0]] = {
                            'x': temp_case[1],
                            'y': temp_case[2]
                        };

                        temp_case = UpperRight[v].trim();
                        temp_case = temp_case.split("\t");
                        xy_arr.UpperRight[temp_case[0]] = {
                            'x': temp_case[1],
                            'y': temp_case[2]
                        };

                        temp_case = Offset[v].trim();
                        temp_case = temp_case.split("\t");
                        xy_arr.Offset[temp_case[0]] = {
                            'x': temp_case[1],
                            'y': temp_case[2]
                        };

                    }
				}

				if(!settings.animated) {
                    xy_arr.LowerLeft = {
                        'x': setup.LowerLeft.split(` `)[0],
                        'y': setup.LowerLeft.split(` `)[1]
                    }
                    xy_arr.LowerRight = {
                        'x': setup.LowerRight.split(` `)[0],
                        'y': setup.LowerRight.split(` `)[1]
                    }
                    xy_arr.UpperLeft = {
                        'x': setup.UpperLeft.split(` `)[0],
                        'y': setup.UpperLeft.split(` `)[1]
                    }
                    xy_arr.UpperRight = {
                        'x': setup.UpperRight.split(` `)[0],
                        'y': setup.UpperRight.split(` `)[1]
                    }
                    xy_arr.Offset = setup.Zindex
				}

				frames = Device.length;
				//console.log('BEFORE: '+frames);
				Frames_arr = [];
				for (var z = 0; z < frames; z++) {

					i_img_uri = _path.basename(Device[z]);

					i_device_uri = Device[z];
					i_mask_uri = l_id_path + '/mask/' + i_img_uri;
					i_mask_uri = (fs.existsSync(i_mask_uri) ? true : false);

					num = parseInt(i_img_uri.replace(/\D/g, ''));

					if(settings.animated) {
                        i_lowerleft = ((xy_arr.LowerLeft[num] != undefined) ? xy_arr.LowerLeft[num] : false);
                        i_lowerright = ((xy_arr.LowerRight[num] != undefined) ? xy_arr.LowerRight[num] : false);
                        i_upperleft = ((xy_arr.UpperLeft[num] != undefined) ? xy_arr.UpperLeft[num] : false);
                        i_upperright = ((xy_arr.UpperRight[num] != undefined) ? xy_arr.UpperRight[num] : false);
                        i_offset = ((xy_arr.Offset[num] != undefined) ? xy_arr.Offset[num] : false);

                        Frames_arr[Frames_arr.length] = {
                            i_mask_uri: i_mask_uri,
                            i_img_uri: i_img_uri,
                            i_upperright: i_upperright,
                            i_upperleft: i_upperleft,
                            i_lowerright: i_lowerright,
                            i_lowerleft: i_lowerleft,
                            i_offset: i_offset
                        }
					}

				}

                if(!settings.animated) {
                    i_lowerleft = xy_arr.LowerLeft
                    i_lowerright = xy_arr.LowerRight
                    i_upperleft = xy_arr.UpperLeft
                    i_upperright = xy_arr.UpperRight
                    i_offset = xy_arr.Offset

                    staticImages = fs.readdirSync(`${path}/${l_id}/devices`);
                    imageTitle = fs.readdirSync(`${path}/${l_id}/devices`);
                    for (var l = 0; l < staticImages.length; l++) {
                        staticImages[l] = `scenes/${id}/${l_id}/devices/${staticImages[l]}/Device.png`

                        Frames_arr.push(
                            {
                                i_img_title: imageTitle[l],
                                i_img_uri: staticImages[l],
                                i_upperright: i_upperright,
                                i_upperleft: i_upperleft,
                                i_lowerright: i_lowerright,
                                i_lowerleft: i_lowerleft,
                                i_offset: i_offset
                            }
                        )
                    }
                }


				data = fs.readFileSync(l_id_path + '/icon.png');
				i_icon_uri = 'data:image/png;base64,' + Buffer.from(data).toString('base64');

				var dimensions = sizeOf(l_id_path + '/screen.jpg');

				s_layers[s_layers.length] = {
					l_id: l_id,
          			l_crop: l_crop,
					l_name: l_name,
					l_cover_ratio: dimensions.width / dimensions.height,
					l_mask_width: dimensions.width,
					l_mask_height: dimensions.height,
					l_icon_uri: i_icon_uri,
					l_data: Frames_arr,
					l_enable: true
				}

			}
			//console.log('AFTER: '+frames);
			var result = {
				s_id: req.params.id,
				s_name: settings.name,
				s_width: settings.width,
				s_height: settings.height,
				s_uri: '/scenes/' + req.params.id + '/',
				s_uri_poster: previews[0],
				s_uri_preview: previews,
				s_mcount: layers.length,
				s_looped: settings.loop,
				s_frames: frames,
				s_layers: s_layers,
                s_animated: settings.animated
			};

			res.send(result);
		}

	} else {
		res.send({
			"status": "error",
			"descr": "scene_not_found"
		});
	}

});

module.exports = router;