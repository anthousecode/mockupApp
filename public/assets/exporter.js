var exportTools = {
	data: {
		vformfile: false,
		vformvideo: false,
		pecentrender: 0,
		renderProcess: false,
		exportFrameEvent: false,
		exportType: false,
		exportUid: 0,
		renderframe: '',
		subrenderer_client: '',
		initWidth: '800',
		exportmode: 'SD',
		vselectmode: false,
		renderStart: false,
		manualModeChange: false,
		cancelMode: false,
		startTime: new Date(),
		endTime: new Date(),
		timeDelta: [],
		estimatedtime: '-:-',
		exportcurrentframe: false,
		videoexport: false,
		safesizeW: 0,
		safesizeh: 0,
		hiResPreloadPercentVid: 0,
		hiResPreloadPercentImg: 0,
	},
	methods: {

	// Метод отвечает за смену разрешения экспорта видео
	// Фактически он не только меняет переменные с разрешением, но и инициализирует прекеширования для данного разрешения в фоне

		changeMode(e) {
			vm.exportmode = e;
			vm.manualModeChange = true;
			var index;
			if (typeof(vm.hiResTextureMockup[0]) == 'undefined') var cursize = 0
			var cursize = 0;
			if (vm.hiResTextureMockup.length)
				cursize = vm.hiResTextureMockup[0].length;
			if (cursize > 0 && vm.hiResTextureMockup[0][0].width != vm.initWidth) {
				for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
					cursize = vm.hiResTextureMockup[layersindex].length;
					for (index = 0; index < cursize; index++) {
						vm.hiResTextureMockup[layersindex][index].destroy(true);
					}
				}
			}
			if (vm.exportmode == 'SD') {
				vm.exportsize[0] = 1280;
				vm.exportsize[1] = 720;
			}
			if (vm.exportmode == 'HD') {
				vm.exportsize[0] = 1920;
				vm.exportsize[1] = 1080;
			}
			if (vm.exportmode == '4k') {
				vm.exportsize[0] = 4096;
				vm.exportsize[1] = 2160;
			}
			vm.hiResLastId = 0;
			vm.hiResPreloadPercentVid = 0;
			vm.hiResPreloadPercentImg = 0;
			vm.URItoMovieClip = '';
			vm.vselectmode = false;
			vm.renderStart = false;
			document.getElementById('export-video').style.boxShadow = "inset 0px 0px 0px 0px #e70000"
			// Вызов метода прекеширования выбранного разрешения в фоне
			vm.preloadHiRes();
		},

		// Основной метод, отвечающий за рендер одного кадра (механизм сборки повторяет базовый из файло pixi.core.js но для одного кадра)
		compositeLayer(index, uid, exportpos = false) {
			vm.startDate = new Date();
			if (vm.cancelMode === true) {
				return false;
			}
			var porthiRes = []

			// Для сборки используется доп рендер subrenderer_client отличный от основного
			var subrenderer_client = new PIXI.Application({
				width: portWidth,
				height: portHeight,
				transparent: true,
				resolution: 1,
				antialias: true,
				powerPreference: "high-performance"
			});
			document.getElementById('techzone').appendChild(subrenderer_client.view);
			subrenderer_client.renderer.width = portWidth;
			subrenderer_client.renderer.height = portHeight;
			var loader = new PIXI.loaders.Loader();
			if (exportpos === true) {
				var portWidth = 4096;
				var portHeight = 2160;
				var exportratio = vm.origsize[0] / portWidth;
				for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
					loader.add(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/device/' + portWidth + '/' + portHeight + '/' + vm.scenestore.s_layers[layersindex].l_data[index].i_img_uri);
				}
			} else {
				var portWidth = vm.exportsize[0];
				var portHeight = vm.exportsize[1];
				var exportratio = vm.origsize[0] / portWidth;
				for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
					let hires = vm.hiResTextureMockup[layersindex][index];
					porthiRes[layersindex] = hires;
				}
			}
			loader.onProgress.add((x) => {
				vm.hiResPreloadPercentImg = x.progress
			});
			loader.load(function(loader, resources) {
				if (exportpos === true) {
					for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
						let hires = new PIXI.Texture.fromImage(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/device/' + portWidth + '/' + portHeight + '/' + vm.scenestore.s_layers[layersindex].l_data[index].i_img_uri);
						porthiRes[layersindex] = hires;
					}
				}
				var scene_background = new PIXI.Graphics()
				var background_gradient = new PIXI.Sprite();
				scene_background.lineStyle(0, 0x000000, 0);
				scene_background.beginFill((0xFFFFFF), 1);
				scene_background.drawRect(0, 0, portWidth, portHeight);
				scene_background.endFill();
				scene_background.tint = vm.rgb2hex([vm.backgroundcolor.rgba.r, vm.backgroundcolor.rgba.g, vm.backgroundcolor.rgba.b]);
				scene_background.alpha = vm.backgroundcolor.rgba.a;
				if (vm.renderwebalpha === true && exportpos === false) {
					scene_background.alpha = 0;
				}
				if (vm.colorsstack.length) {
					var canvas = document.getElementById('subrender1');
					canvas.width = portWidth
					canvas.height = portHeight
					var context = canvas.getContext('2d');
					context.rect(0, 0, canvas.width, canvas.height);
					var grd = context.createLinearGradient(0, 0, canvas.width, 0);
					vm.colorsstack.forEach(function(element) {
						let color = [];
						if (element.match(/rgba/)) {
							color = element.split(') ');
							color[0] = color[0] + ')';
						} else color = element.split(' ');
						color[1] = parseInt(color[1]) / 100;
						grd.addColorStop(color[1], color[0]);
					});
					context.fillStyle = grd;
					context.fill()
					background_gradient.alpha = 1;
					background_gradient.texture = new PIXI.Texture.fromCanvas(canvas);
					background_gradient.texture.update();
				}
				subrenderer_client.stage.addChild(scene_background);
				if (vm.renderwebalpha === false) {
					subrenderer_client.stage.addChild(background_gradient);
				}
				//vm.colorsstack = [];
				for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
					var deform = vm.quad_origin[layersindex][index];
					if (exportpos === true) {
						if (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft !== false) {
							let offsetx = 0 - vm.scenestore.s_layers[layersindex].l_data[index].i_offset.x;
							let offsety = 0 - vm.scenestore.s_layers[layersindex].l_data[index].i_offset.y;
							let obj_origin = [
							vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.x - offsetx) / exportratio, (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.y - offsety) / exportratio),
							vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.x - offsetx) / exportratio, (vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.y - offsety) / exportratio),
							vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.x - offsetx) / exportratio, (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.y - offsety) / exportratio),
							vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.x - offsetx) / exportratio, (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.y - offsety) / exportratio),
						];
							deform = obj_origin.map(function(s) {
								return s.position
							});
						} else {
							deform = [vm.setPoint(0, 0), vm.setPoint(1, 0), vm.setPoint(1, 1), vm.setPoint(0, 1)].map(function(s) {
								return s.position
							});
						}
					}

					var texture_cover_distort = new PIXI.projection.Sprite2d(vm.cover_object[layersindex].texture);
					var texture_cover_distort_mask = new PIXI.projection.Sprite2d(vm.mask_object[layersindex].texture);
					var renderTextureCover = PIXI.RenderTexture.create(portWidth, portHeight);
					var renderTextureMask = PIXI.RenderTexture.create(portWidth, portHeight);
					texture_cover_distort.proj.mapSprite(texture_cover_distort, deform);
					texture_cover_distort_mask.proj.mapSprite(texture_cover_distort_mask, deform);
					subrenderer_client.renderer.render(texture_cover_distort, renderTextureCover);
					subrenderer_client.renderer.render(texture_cover_distort_mask, renderTextureMask);
					//var mockup_layer = new PIXI.Sprite(porthiRes[layersindex]);
					var blink_layer = new PIXI.Sprite(porthiRes[layersindex]);
					var cover_layer = new PIXI.Sprite(renderTextureCover)
					var mask_layer = new PIXI.Sprite(renderTextureMask)
					blink_layer.blendMode = vm.blend_mode;
					var cover_container = new PIXI.Container()
					cover_container.addChild(cover_layer);
					cover_container.addChild(blink_layer);
					cover_container.addChild(mask_layer);
					cover_container.mask = mask_layer;
					//subrenderer_client.stage.addChild(mockup_layer);
					subrenderer_client.stage.addChild(cover_container);
				}
				console.log('Sent frame #', index);
				var renderTexture = PIXI.RenderTexture.create(portWidth, portHeight);

/*
				subrenderer_client.stage.filters = [new PIXI.filters.AdjustmentFilter({
						gamma: vm.effectgamma + 1,
						contrast: vm.effectcontrast + 1,
						saturation: vm.effectsaturation + 1,
						brightness: vm.effectbrightness + 1,
					})];
*/

					/*,

					new PIXI.filters.OldFilmFilter({
													sepia: 0,
													noise: vm.effectnoise,
													noiseSize: vm.effectnoisesize,
													scratch: -1,
													scratchDensity: 0,
													scratchWidth: 1,
													vignetting: 0,
													vignettingAlpha: 0,
													vignettingBlur: 0
												}, 0.1),
					new PIXI.filters.PixelateFilter(vm.effectpixilate)*/

				subrenderer_client.renderer.render(subrenderer_client.stage, renderTexture);
				if (exportpos === true) {
					vm.waitRenderReady = true;
					subrenderer_client.render()
					console.log('render frame')
					subrenderer_client.renderer.extract.canvas(renderTexture).toBlob(function(b) {
						subrenderer_client.destroy(true)
						vm.exportFrameStatus = false;
						vm.vformfile = false
						vm.renderProcess = false
							// vm.exportsize[0] = vm.safesizeW;
							// vm.exportsize[1] = vm.safesizeH;
						var a = document.createElement('a');
						document.body.append(a);
						a.download = vm.formfile.name + '.png';
						a.href = URL.createObjectURL(b);
						a.click();
						a.remove();
						vm.waitRenderReady = false;
						vm.renderwebalpha = false;
						vm.hiResPreloadPercentImg = 0;
					}, 'image/png');
				} else {
						console.log('render video')
					var dataofframe = subrenderer_client.renderer.extract.base64(renderTexture);
					// vm.sequence.push(dataofframe);
					// console.log( 'arrChunk', vm.sequence);
					axios.post('/api/exportvideo', {
						unique_id: uid,
						scene_id: vm.scenestore.s_id,
						frame: index,
						count: vm.scenestore.s_frames,
						chunk: dataofframe,
						filename: vm.formvideo.name,
						email: vm.formvideo.email,
						renderalpha: vm.renderwebalpha,
						width: portWidth,
						height: portHeight
					}).then(function(r) {
						subrenderer_client.destroy(true)
						console.log(index);
						console.log(portWidth, portHeight);


						index++;
						vm.pecentrender = Math.round(index / (vm.scenestore.s_frames) * 100);
						vm.endDate = new Date();
						var timeDelta = vm.endDate.getTime() - vm.startDate.getTime();
						vm.timeDelta.push(timeDelta);
						timeDelta = _.sum(vm.timeDelta) / vm.timeDelta.length
						var totalsecs = parseInt((timeDelta / 1000) * (vm.scenestore.s_frames - index));
						var totalmins = parseInt(totalsecs / 60);
						var totalhours = parseInt(totalsecs / 3600);
						var totaldays = parseInt(totalsecs / 3600 / 24);
						if (totalhours > 24) totalhours = totalhours % 24
						if (totalmins > 60) totalmins = totalmins % 3600
						if (totalsecs > 60) totalsecs = totalsecs % 60
						if (vm.cancelMode === false) vm.estimatedtime = totaldays + ' days left';
						if (totaldays == 0) vm.estimatedtime = totalhours + ':' + totalmins + ' left';
						if (totaldays == 0 && totalhours == 0) vm.estimatedtime = totalmins + ' minutes and ' + totalsecs + ' seconds left';
						if (totaldays == 0 && totalhours == 0 && totalmins == 0) vm.estimatedtime = totalsecs + ' seconds left';
						if (totaldays == 0 && totalhours == 0 && totalmins == 0 && totalsecs < 15) vm.estimatedtime = 'less the 15 seconds left';
						if (totaldays == 0 && totalhours == 0 && totalmins == 0 && totalsecs < 5) vm.estimatedtime = 'less the 5 seconds left';
						if (index < vm.scenestore.s_frames) vm.compositeLayer(index, uid, false);
						else {
							vm.waitRenderReady = true;
							var getStatus = setInterval(function() {
								vm.estimatedtime == '-:-'
								console.log('waiting for video...')
								if (vm.waitRenderReady === true) {
									axios.post('/api/exportvideo', {
										unique_id: uid,
										filename: vm.formvideo.name,
										email: vm.formvideo.email
									}).then(function(answer) {
										if (answer.data.status == 'success') {
											console.log('URL is ready! http://mockupapp.io/export/' + uid + '/' + vm.formvideo.name + '.mp4');
											vm.URItoMovieClip = 'http://mockupapp.io/export/' + uid + '/' + vm.formvideo.name + '.mp4';
											vm.currentframe = 0;
											vm.waitRenderReady = false
											document.getElementById("canvas").style.display = "block"
											vm.hiResPreloadPercentVid = 0;
											vm.renderwebalpha = false;
											vm.videoexport = false;
											clearInterval(getStatus)
										}
										//console.log(answer.data.status)
									});
								}
							}, 500);
						}
					}).catch(function(error) {
						console.log(error);
					});
				}
			});
		},
		// Export video
		outRenderAppClose() {
			vm.renderProcess = false;
			vm.cancelMode = true;
			vm.hiResPreloadPercentVid = 0;
			vm.videoexport = false;
			vm.renderwebalpha = false;
			vm.estimatedtime = "-:-";
		},
		outRenderApp() {
			vm.cancelMode = false;
			/*if (exportpos === true) {

				vm.safesizeW = vm.exportsize[0];
				vm.safesizeH = vm.exportsize[1];
				vm.exportsize[0] = 4096;
				vm.exportsize[1] = 2160;
					for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
					vm.hiResTextureMockup[layersindex][index] = new PIXI.Texture.fromImage(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/device/' + vm.exportsize[0] + '/' + vm.exportsize[1] + '/' + vm.scenestore.s_layers[layersindex].l_data[index].i_img_uri);
					}
			}
*/
			var checkTexturesLoaded = setInterval(function() {
				if (vm.loadedframe == vm.scenestore.s_frames /*&& vm.hiResLastId == (vm.scenestore.s_frames * vm.scenestore.s_mcount)*/ ) {
					clearInterval(checkTexturesLoaded);
					console.log('start');
					vm.renderStart = true;
					if (vm.exportcurrentframe === true) {
						vm.exportcurrentframe = false;
						vm.videoexport = false;
						console.log(vm.videoexport)
						vm.compositeLayer(vm.currentframe, 0, true);
					} else {
						vm.videoexport = true;
						console.log(vm.videoexport)
						axios.post('/api/exportvideo', {
							stream: 'start'
						}).then(function(response) {
							vm.compositeLayer(0, response.data.unique_id, false);
						});
					}
					////////////////////////////////////////////////////////////////////////////////
				}
			}, 500);
		},
		// метод настраивающий экспорт кадров\или кадра в зависимости от параметра oneFrame
		exportSequence(oneFrame = false) {
			vm.exportcurrentframe = oneFrame;
			vm.exportFrameStatus = false;
			vm.vformfile = false
			vm.vformvideo = false
			vm.renderProcess = true;
		},
		// метод для скачивания файла вместо просмотра
		downloadFile() {
			//window.location.href = vm.URItoMovieClip;
			var a = document.createElement('a');
			document.body.append(a);
			a.download = vm.vformvideo.name + '.mp4';
			a.href = vm.URItoMovieClip;
			a.click();
			a.remove();
		}
	}
}
