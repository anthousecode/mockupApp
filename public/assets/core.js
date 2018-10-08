// Вызов компонента vue-croppa
Vue.use(Croppa)
// Локализация elements.io  для английского языка
ELEMENT.locale(ELEMENT.lang.en);
	/////////////////////////////////////////////////////////////////
  // Настроки для vuex
	/////////////////////////////////////////////////////////////////
const store = new Vuex.Store({
	state: {
		scenestore: [],
		isAnimated: null,
	},
	mutations: {
		loaddata(state, data) {
			state.scenestore = data;
			state.scenestore.s_frames = state.scenestore.s_frames
		},
		changeCropZoneTo(state, data) {
			state.scenestore.s_layers[data.layer].l_crop = data.positions;
		}
	}
});
 // Определяем компонент vue-color
var sketch = VueColor.Sketch;
	/////////////////////////////////////////////////////////////////
  // Настроки для vue-router
	/////////////////////////////////////////////////////////////////
const router = new VueRouter({
		mode: 'history',
		routes: [{
			path: '/',
			component: SceneLoad
		},
		{
			path: '/edit/:id',
			component: SceneEditor
		},
		{
			path: '/static/:id',
			component: StaticSceneEditor
		}
		]
	})
	/////////////////////////////////////////////////////////////////
  // Основная часть
	/////////////////////////////////////////////////////////////////
var vm = new Vue({
		el: '#app',
		mixins: [definitions, keyEvents, mouseEvent, /*renderCore,*/ renderStaticCore, exportStaticTools, exportTools, helpersTools, toolsActivators, shapesDrawers],
		delimiters: ['${', '}'],
		router: router,
		components: {
			'colorpicker': sketch,
			'vueSlider': window['vue-slider-component'],
			'radSlider': radslider
		},
		data: {
			sequence: [],
			croppa: {},
			videoControl: false,
			videoSlider: [0,1],
			videoPlayButton: 'icon-2',
			exportFrameStatus: false,
			sliderShow: false,
			sliderVal: 0,
			sliderMin: 0,
			sliderMax: 0,
			dlgloader : false,
			vidloader : 0,
			resoptions: [{
				value: '1',
				label: 'Full resolution'
        }, {
				value: '2',
				label: 'Half resolution'
        }, {
				value: '3',
				label: '1/4 resolution'
        }],
			resvalue: '1',
			renderer_client: null,
			renderer_production: null,
			ratio: '',
			reduceratio: 1,
			exportratio: 1,
			rendertype: '',
			origratio: '',
			origratiolock: true,
			origsize: [],
            sceneSize: [],
			exportsize: [3250, 2250],
			size: [0, 0],
			fileList: [{
				name: 'test.jpeg',
				url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
		}],
		iconfill : '',
			backgroundcolor: {
				rgba: {
					'a': 1,
					'b': 255,
					'g': 255,
					'r': 255
				}
			},


			subscribe: true,
			cntrkey: false,
			toolbars: [],
			animation: '',
			currentframe: 0,
			loadedframe: 0,
			playing: false,
			scale: 100,
			minscale: 10,
			maxscale: 100,
			stepscale: 25,
			playbutton: 'icon-2',
			playstate: '',
			idscope: 0,
			usetool: '',
			prebufferframes: 10,
			objlayer1: {
				x: 0,
				y: 0,
				layerX: 0,
				layerY: 0,
				zoneX1: 0,
				zoneY1: 0,
				zoneX2: 0,
				zoneY2: 0
			},
			isMouseDown: false,
			isDraw: false,
			isDrawCurve: false,
			isHoldSpace: false,
			isDragCanvas: {
				"status": false,
				"position": {
					"x": 0,
					"y": 0
				},
				"target": {
					"top": 0,
					"left": 0
				}
			},
			fps: 0,
			fpscolor: 'success',
			fpswarning: false,
			URItoMovieClip: '',
			isShiftPress: false,
			isAltPress: false,
			borderround: 1,
			starCorners: 5,
			layer2select: -1,
			tool_selector: new PIXI.Graphics(),
			layers: [],
			waitRenderReady: false,
			formfile: {
				name: 'frame',
				email: ''
			},
			formvideo: {
				name: 'movieclip',
				email: ''
			},
			rubberband: [],
			repeat_btn_state: false,
			repeat_btn_class: 'repeat-btn-off',
			defaultSliderZoomOpt: {
				tooltip: false,
				piecewiseLabel: false,
				tooltip: false,
				height: 3,
				dotSize: 30,
				width: "100%",
				show: true,
				realTime: true,
				class: "zoom-slider"
			},
			defaultSliderOpt: {
				piecewiseLabel: true,
				tooltip: false,
				height: 3,
				dotSize: 30,
				width: "100%",
				show: true,
				speed: 0,
				class: "star-slider"
			},

			durationvideo: 0,
			colorsstack: [],
			renderwebalpha: false,
			a: 270,
			gradienttype: [
				{
         gradienttypevalue: 'linear',
          label: 'Linear'
        },
        {
          gradienttypevalue: 'radial',
          label: 'Radial'
        }
        ],
        gradienttypevalue: 'linear',
        // gp: new Grapick({
			// 	el: '#grapick',
			// 	direction: 'to right',
			// 	min: 1,
			// 	max: 99,
			// 	height: '19px'
			// 	}),
				x1:0,
				y1:0,
				x2:0,
				y2:0,
        gradientlist: [],
        gradientrender:true,
        isshowcolorgradient:false,
        handler:'',
        colorgradient:{
					rgba: {
						'a': 1,
						'b': 255,
						'g': 255,
						'r': 255
					},
				},
            	staticDeviceDialog: false

		},
		computed: {
			scenestore() {
				return store.state.scenestore
			}
		},
		mounted: function() {
// Инициализация всего и вся
			this.rendertype = "WebGL"
// Работаем только в WEBGL так как в canvas режиме у нас нет матрицы деформации 3x3x3
// B соответственно при canvas режиме у нас будет ошибка
			if (!PIXI.utils.isWebGLSupported()) {
				this.rendertype = "canvas"
			}
			this.$nextTick(function() {
// Событие на ресайд окна браузера
				window.addEventListener('resize', this.resize);
			})

// Загрузка списка градиентов
		axios.post('/api/gradientlist/').then(function(response) {
			vm.gradientlist = response.data;
		}).catch(function(error) {
			console.log(error);
		});

// Инициализация бара по управлению градиентом
			this.gp = new Grapick({
				el: '#grapick',
				direction: 'to right',
				min: 5,
				max: 95,
				height: '45px',
				colorEl: '<span id="colorpicker"></span>'
			})

		// Используем свой кастомный колопикер в баре с градиентом
    this.gp.setColorPicker(handler => {
  	const el = handler.getEl().querySelector('#colorpicker');
		//el.innerHTML = `<span class="colorpicker" onclick="vm.openCustomColorpicker()"></span>`
		this.handler = handler;
    //this.isshowcolorgradient = true;
    // handler.setColor(color.toRgbString(), 0);
    });
		this.gp.addHandler(5, '#E5E5E5');
		this.gp.addHandler(95, '#6C6C71');

    // обработчик события измения градиента
		this.gp.on('change', complete => {
				if(vm.gradientrender === true){
				let colors = this.gp.getColorValue();
				console.log(`colors`, colors)
				let csscolors = this.gp.getValue();
				vm.iconfill = 'background:'+csscolors
				vm.colorsstack = colors.split("%, ");
				var canvas = document.getElementById('subrender2');
				canvas.width = vm.size[0]
				canvas.height = vm.size[1]
				var context = canvas.getContext('2d');
				context.rect(0, 0, canvas.width, canvas.height);

				vm.x1 = 0;
				vm.y1 = 0;
 				vm.x2 = canvas.width;
				vm.y2 = canvas.height;

					if(vm.gradienttypevalue == 'linear')
					var grd = context.createLinearGradient(vm.x1, vm.y1, vm.x2, vm.y2 );
					if(vm.gradienttypevalue == 'radial')
					var grd = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);

				vm.colorsstack.forEach(function(element) {
					let color = [];
					if (element.match(/rgba/)) {
						color = element.split(') ');
						color[0] = color[0] + ')';
					} else color = element.split(' ');
					color[1] = parseInt(color[1]) / 100;
					grd.addColorStop(color[1], color[0]);
				});

				// Из полученных данных формируем на фоне канвас, содержимое которого используем в качестве текстуры для объекта в базовом рендере
				context.fillStyle = grd;
                    vm.canvas = canvas
				context.fill()
				vm.background_gradient.alpha = 1;
				vm.background_gradient.texture = new PIXI.Texture.fromCanvas(canvas);
				vm.background_gradient.texture.update();
			}
			})
/*
// Часть от решения с кастомным цветным слайдером "от центра"
			document.getElementById("effectgamma").getElementsByClassName('el-slider__button-wrapper')[0].style.display = 'none';
			document.getElementById("effectsaturation").getElementsByClassName('el-slider__button-wrapper')[0].style.display = 'none';
			document.getElementById("effectcontrast").getElementsByClassName('el-slider__button-wrapper')[0].style.display = 'none';
			document.getElementById("effectbrightness").getElementsByClassName('el-slider__button-wrapper')[0].style.display = 'none';
*/
		},
/*
// Возможное решение для кастомного цветного слайдера фильтров "от центра"
 watch: {
    effectgamma: function (val) {
     vm.disableStartPoint('effectgamma')
    },
    effectsaturation: function (val) {
     vm.disableStartPoint('effectsaturation')
    },
     effectcontrast: function (val) {
     vm.disableStartPoint('effectcontrast')
    },
     effectbrightness: function (val) {
     vm.disableStartPoint('effectbrightness')
    }
},
*/
		methods: {
////////////////////////////////////////////////////////////////////////////////
changeEffect: function(e){
/*
// Решение для кастомного цветно слайдера "от центра" на базе range слайдера
var leftbar = 'block';
var rightbar = 'block';
if(vm[e][0]==0 && vm[e][1]>0){
document.getElementById(e).getElementsByClassName('el-slider__bar')[0].style.backgroundColor ="#FFE100"
leftbar = 'block';
rightbar = 'none';
}
if(vm[e][0]<0 && vm[e][1]==0){
document.getElementById(e).getElementsByClassName('el-slider__bar')[0].style.backgroundColor ="#FF5000"
}
*/
},
////////////////////////////////////////////////////////////////////////////////
disableStartPoint: function(e){
/*
// Решение для кастомного цветно слайдера "от центра" на базе range слайдера
var leftbar = 'block';
var rightbar = 'block';
if(vm[e][0]==0 && vm[e][1]>0){
leftbar = 'none';
rightbar = 'block';
document.getElementById(e).getElementsByClassName('el-slider__bar')[0].style.backgroundColor ="#FFE100"
}
if(vm[e][0]<0 && vm[e][1]==0){

leftbar = 'block';
rightbar = 'none';
document.getElementById(e).getElementsByClassName('el-slider__bar')[0].style.backgroundColor ="#FF5000"
}
document.getElementById(e).getElementsByClassName('el-slider__button-wrapper')[0].style.display = leftbar;
document.getElementById(e).getElementsByClassName('el-slider__button-wrapper')[1].style.display = rightbar;
*/
},
////////////////////////////////////////////////////////////////////////////////

// Метод удаляющий "цветовую точку" в градиенте, при условии что она не последняя
deleteGradientPicker: function(e){
if(vm.gp.getHandlers().length > 1){
vm.handler = vm.gp.getSelected();
vm.handler.remove();
}
var handlerList = vm.gp.getHandlers();
vm.handler = handlerList[0];
vm.handler.select()
},
// Метод отправляет на бек градиент и бэкграунд сцены
sendBackGrad(background, gradient){
	if(vm.sendBackground){
		axios.post('/api/exportbackground', {
			background: background,
			gradient: gradient
		}).then((r)=>{
			console.log('background',r.data);
		})

		vm.sendBackground = false;
	}
},
// Изменение цвета "цветовой точки" в градиенте
changeGradientPicker: function(e){
vm.handler = vm.gp.getSelected()
vm.handler.setColor('rgba('+vm.colorgradient.rgba.r+','+vm.colorgradient.rgba.g+','+vm.colorgradient.rgba.b+','+vm.colorgradient.rgba.a+')');
},

// Метод автосмены типа залифки фона от выбора соотвествующего таба на пенели
backgroundchanger: function(e){
if(e == 'flat'){this.background_gradient.alpha = 0;this.scene_bgimage.alpha = 0;}
if(e == 'linear'){this.gp.change();this.background_gradient.alpha = 1;this.scene_bgimage.alpha = 0;}
if(e == 'radial'){this.background_gradient.alpha = 0;this.scene_bgimage.alpha = 1;}
},

// Метод для установки градиента из некой внешне svg_data - то что мы получаем из готовых градиентов
setGradient: function(svg_data){
var i;
vm.gradienttypevalue = svg_data.type;
var stoppoints = svg_data.color.length;
vm.gradientrender = false;
vm.gp.clear()
for (i = 0; i < stoppoints; i++) {
vm.gp.addHandler(parseInt(svg_data.position[i]), svg_data.color[i]);
}
vm.gradientrender=true;
vm.gp.change()
},

// Обработчик на любую смену градиента
gradientchange: function(e){

				if(vm.gradienttypevalue != `flat`) {
                    let colors = this.gp.getColorValue();
                    vm.colorsstack = colors.split("%, ");
                    var canvas = document.getElementById('subrender2');
                    canvas.width = vm.size[0]
                    canvas.height = vm.size[1]
                    var context = canvas.getContext('2d');
                    context.rect(0, 0, canvas.width, canvas.height);

                    if(vm.gradienttypevalue == 'linear')
                        var grd = context.createLinearGradient(vm.x1, vm.y1, vm.x2, vm.y2 );
                    if(vm.gradienttypevalue == 'radial')
                        var grd = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);

                    let csscolors = this.gp.getValue();
                    vm.iconfill = 'background:'+csscolors

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
                    vm.background_gradient.alpha = 1;
                    vm.background_gradient.texture = new PIXI.Texture.fromCanvas(canvas);
                    vm.background_gradient.texture.update();
				}
			},
// Обработчик который используется для отрисовки направления градиента в зависимости от исходного угла полученного из компонента слайцдера
// В математике расчета есть ошибка в нижней левой верхней получетверти	- нужно поправить
			rotate: function(name, degree) {
				function deg2rad(degrees) {
					var pi = Math.PI;
					return degrees * (pi / 180);
				}
				if (this.colorsstack.length) {
					var canvas = document.getElementById('subrender2');
					canvas.width = this.size[0]
					canvas.height = this.size[1]
					var context = canvas.getContext('2d');
					context.rect(0, 0, canvas.width, canvas.height);
					var x1 = 0;
					var y1 = 0;
					var x2 = canvas.width;
					var y2 = 0;
					if (degree == 0) {
						x1 = 0;
						y1 = 0;
						x2 = 0;
						y2 = canvas.height;
					} else if (degree == 90) {
						x1 = canvas.width;
						y1 = 0;
						x2 = 0;
						y2 = 0;
					} else if (degree == 180) {
						x1 = 0;
						y1 = canvas.height;
						x2 = 0;
						y2 = 0;
					} else if (degree == 270) {
						x1 = 0;
						y1 = 0;
						x2 = canvas.width;
						y2 = 0;
					} else if (degree > 270 && degree < 360) {
						var normangle = 360 - degree;
						var angle = 90 - normangle;
						var b = (canvas.height / 2) / Math.tan(deg2rad(angle));
						if (b <= (canvas.width / 2)) {
							y1 = 0;
							y2 = canvas.height;
							x1 = (canvas.width / 2) - b;
							x2 = canvas.width - x1;
						} else {
							var normangle = 90 - (360 - degree);
							var angle = 90 - normangle;
							var b = (canvas.width / 2) / Math.tan(deg2rad(angle));
							x1 = 0;
							x2 = canvas.width;
							y1 = (canvas.height / 2) - b;
							y2 = canvas.height - x1;
						}
					} else if (degree > 180 && degree < 270) {
						var normangle = 270 - degree;
						var angle = 90 - normangle;
						var b = (canvas.width / 2) / Math.tan(deg2rad(angle));
						if (b <= (canvas.height / 2)) {
							x1 = 0;
							x2 = canvas.width;
							y1 = (canvas.height / 2) + b;
							y2 = canvas.height - y1;
						} else {
							var normangle = 90 - (270 - degree);
							var angle = 90 - normangle;
							var b = (canvas.height / 2) / Math.tan(deg2rad(angle));
							y1 = canvas.height;
							y2 = 0;
							x1 = (canvas.width / 2) - b;
							x2 = canvas.width - x1;
						}
					} else if (degree > 90 && degree < 180) {
						var normangle = 180 - degree;
						var angle = 90 - normangle;
						var b = (canvas.height / 2) / Math.tan(deg2rad(angle));
						if (b <= (canvas.width / 2)) {
							y2 = 0;
							y1 = canvas.height;
							x1 = (canvas.width / 2) + b;
							x2 = canvas.width - x1;
						} else {
							var normangle = 90 - (180 - degree);
							var angle = 90 - normangle;
							var b = (canvas.width / 2) / Math.tan(deg2rad(angle));
							x2 = 0;
							x1 = canvas.width;
							y1 = (canvas.height / 2) + b;
							y2 = (canvas.height) - y1;
						}
					} else if (degree > 0 && degree < 90) {
						var normangle = degree;
						var angle = 90 - normangle;
						var b = (canvas.height / 2) / Math.tan(deg2rad(angle));
						if (b <= (canvas.width / 2)) {
							y1 = 0;
							y2 = canvas.height;
							x1 = (canvas.width / 2) + b;
							x2 = canvas.width - x1;
						} else {
							var normangle = 90 - (degree);
							var angle = 90 - normangle;
							var b = (canvas.width / 2) / Math.tan(deg2rad(angle));
							x1 = canvas.width;
							x2 = 0;
							y1 = (canvas.height / 2) - b;
							y2 = canvas.height - y1;
						}
					}
				vm.x1 = x1;
				vm.y1 = y1;
 				vm.x2 = x2;
				vm.y2 = y2;
				var grd = context.createLinearGradient(vm.x1, vm.y1, vm.x2, vm.y2);
				this.colorsstack.forEach(function(element) {
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
					this.background_gradient.alpha = 1;
					this.background_gradient.texture = new PIXI.Texture.fromCanvas(canvas);
					this.background_gradient.texture.update();
				}
				// document.documentElement.style.setProperty('--' + name, degree)
			},

			formatSlider(val) {
				return val / 100;
			},
			// Очистка канвас для аплоада пользовательских картинко
			onUploadImageClear(){
					this.croppa.remove();
			},
			// Обработчик для аплоада фото или видео в мокап
			uploadCroppedImage() {
                vm.staticDeviceDialog = false;
				vm.dlgMockupUploader = false;
				if (this.croppa.videoEnabled && this.croppa.video) {
				var pre_cover = [];
				var vidframe;
 				var video = document.createElement("video");
				video.preload = "auto";
				video.src = this.croppa.video.src;
				video.addEventListener('loadeddata', function() {
				vm.vidloader = 0;
				vm.dlgloader = true;
    		vidframe = vm.videoSlider[0];
    		video.currentTime = vidframe / 29.97
    		console.log(vidframe,video.currentTime )
				}, false);

				video.addEventListener('seeked', function() {
    		generateThumbnail(vidframe);

				vm.vidloader = parseInt((vidframe-vm.videoSlider[0]) / vm.scenestore.s_frames * 100)

    		vidframe++;
    		if (vidframe <= vm.videoSlider[1]) {
        		video.currentTime = vidframe / 29.97
    		}
			else {
			//console.log('all sequence`s images were finished')
					vm.dlgloader = false;
					for (index = 0; index < vm.scenestore.s_frames; index++) {
							vm.coversequence[vm.currentMockup][index].texture = PIXI.Texture.fromImage(pre_cover[index]);

					}
			}
			}, false);

function generateThumbnail(i) {
	//console.log('gen frame'+i)
  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");
  c.width = 160; // нужно поменять на реальное разрешение
  c.height = 90; // нужно поменять на реальное разрешение
  ctx.drawImage(video, 0, 0, 160, 90); // нужно поменять на реальное разрешение
  pre_cover.push(c.toDataURL());
}

//var imgsrc = this.croppa.generateDataUrl('image/png')
//vm.cover_object[vm.currentMockup] = new PIXI.extras.AnimatedSprite(vm.loResTextureMockup[layersindex]);


			for (vidframe = vm.videoSlider[1]; vidframe < vm.videoSlider[0]; vidframe++) {
			this.croppa.video.currentTime =	vidframe / 29.97
			pre_cover.push(this.croppa.generateDataUrl('image/png'))
			}
				} else {
					var imgsrc = this.croppa.generateDataUrl('image/png')
					vm.cover_object[vm.currentMockup].texture = PIXI.Texture.fromImage(imgsrc)
				}

				this.sliderShow = false;
				this.croppa.remove();
			},
			onImageRemove() {
				this.sliderShow = false;
						vm.iscover = true;
			},
			onVideoControl() {
				if (vm.videoPlayButton == "icon-2") {
					vm.videoPlayButton = "icon-Stop";
					this.croppa.video.play();
				} else {
					vm.videoPlayButton = "icon-2";
					this.croppa.video.pause();

				}
			},
			onBGImageUpdate() {
				var imgsrc = this.croppa.generateDataUrl('image/png');
			  document.getElementById("button-fill").style.backgroundImage = "url("+imgsrc +")";
				var ips =  new ﻿PIXI.Sprite(PIXI.Texture.fromImage(imgsrc));
				vm.scene_bgimage.removeChildren();
				vm.scene_bgimage.addChild(ips);
			},
			onBGImageRemove(){
     		vm.scene_bgimage.removeChildren();
			},
			onNewImage() {
				vm.iscover = false;
				this.sliderVal = this.croppa.scaleRatio
				this.sliderMin = this.croppa.scaleRatio / 2
				this.sliderMax = this.croppa.scaleRatio * 2
				this.sliderShow = true;
				if (this.croppa.videoEnabled && this.croppa.video) {
					this.videoControl = true;
					this.durationvideo = parseInt(this.croppa.video.duration * 29.97)
					this.videoSlider[0] = 0;
					this.videoSlider[1] = (this.scenestore.s_frames > this.durationvideo) ? this.durationvideo : this.scenestore.s_frames;
					var _this = this;
					this.croppa.video.ontimeupdate = function() {
						let frame = parseInt(vm.croppa.video.currentTime * 29.97);
						if (frame > vm.videoSlider[1]) {
							frame = vm.videoSlider[0];
							vm.croppa.video.currentTime = frame / 29.97;
						}
					};
				}
			},
			onVideoPosChange(e) {
				vm.croppa.video.currentTime = e[0] / 29.97;

			},
			onSliderChange(evt) {
				console.log(evt)
				var increment = evt; //.target.value
				this.croppa.scaleRatio = +increment
			},
			onZoom() {
				// To prevent zooming out of range when using scrolling to zoom
				// if (this.sliderMax && this.croppa.scaleRatio >= this.sliderMax) {
				//   this.croppa.scaleRatio = this.sliderMax
				// } else if (this.sliderMin && this.croppa.scaleRatio <= this.sliderMin) {
				//   this.croppa.scaleRatio = this.sliderMin
				// }
				this.sliderVal = this.croppa.scaleRatio
			},
			testtooltip(e) {
				return e;
			},
			// Добавление слоя с данными
			addLayer(layerController, layerTitle = '', layerIcon = '', opt_isRemovable = true, opt_isHidden = false) {
				var set = [];
				if (!layerTitle) layerTitle = layerController
				if (!layerIcon) {
					if (layerController == 'background') {
						layerIcon = 'fa fa-paint-brush';
					} else if (layerController == 'drawtext') {
						layerIcon = 'fa fa-font';
					} else if (layerController == 'drawcurve') {
						layerIcon = 'fa fa-font';
					} else if (layerController == 'drawcircle') {
						layerIcon = 'fa fa-gg';
					} else if (layerController == 'drawrect') {
						layerIcon = 'fa fa-gg';
					} else if (layerController == 'drawstar') {
						layerIcon = 'fa fa-gg';
					} else if (layerController == 'drawshape') {
						layerIcon = 'fa fa-gg';
					} else if (layerController == 'mockup') {
						layerIcon = 'fa fa-gg';
					}
				}
				vm.layers.unshift({
					'id': vm.idscope,
					'removable': opt_isRemovable,
					'userpicWidth': 1,
					'userpicHeight': 1,
					'icon': layerIcon,
					'title': layerTitle,
					'hidden': opt_isHidden,
					'controller': layerController,
					'globject': (layerController == 'drawtext') ? new PIXI.Text('Sample') : new PIXI.Graphics(),
					'curvePath': [],
					'textStyle': new PIXI.TextStyle()
				})
				_.transform(vm.toolbars, function(result, key) {
					result.push(key + 1)
				}, set);
				vm.toolbars = set;
				vm.toolbars.unshift(0);
				return vm.idscope++
			},
			// Обработка события "данные загружены"
			checkdataloaded(e) {
				this.idscope = 0;
				this.layers = [];
				this.layers.push({
					id: this.idscop,
					removable: true,
					icon: 'fa fa-paint-brush',
					title: 'Background',
					'hidden': false,
					controller: 'background'
				})
				var i = this.scenestore.s_mcount;
				while (i--) {
					vm.addLayer('mockup', this.scenestore.s_layers[i].l_name, this.scenestore.s_layers[i].l_icon_uri, false, !this.scenestore.s_layers[i].l_enable)
					//this.toolbars = [];
				}
				vm.formvideo.name = 'movie_' + this.scenestore.s_id;
				//vm.size[0] = screen.width
				//vm.size[1] = screen.height
				vm.origsize[0] = vm.scenestore.s_width;
				vm.origsize[1] = vm.scenestore.s_height;

                vm.origsize = [vm.scenestore.s_width, vm.scenestore.s_height]
                var sceneWidth = 1310
                var sceneHeigth = (sceneWidth * vm.scenestore.s_height)/vm.scenestore.s_width
                vm.sceneSize = [sceneWidth, sceneHeigth]

				//Выставляем исходное разрешение для рендера
				//vm.renderScene(1920, 1080);
				//vm.renderScene(1280, 720);
        //vm.renderScene(800, 450);
				vm.renderScene(vm.sceneSize[0], vm.sceneSize[1]);
			},
			/********************* Show rubber band ***********************/
			// Инициализация выделялки объекта
			setRubberBand(x1, y1, x2, y2) {
				vm.rubberband[0].x = x1
				vm.rubberband[0].y = y1
				vm.rubberband[1].x = x2
				vm.rubberband[1].y = y1
				vm.rubberband[2].x = x2
				vm.rubberband[2].y = y2
				vm.rubberband[3].x = x1
				vm.rubberband[3].y = y2
			},
			rgb2hex(rgb) {
				return rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
			},
			opt_repeat_btn() {
				vm.repeat_btn_state = !vm.repeat_btn_state;
				if (vm.repeat_btn_state) vm.repeat_btn_class = 'repeat-btn-on';
				else vm.repeat_btn_class = 'repeat-btn-off';
				for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
					vm.mockup_object[layersindex].loop = vm.repeat_btn_state;
					vm.mockup_object_blink[layersindex].loop = vm.repeat_btn_state;
				}
			},
			// Change blend mode for mockup
			changeblend() {
				for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
					vm.mockup_object_blink[layersindex].blendMode = vm.blend_mode;
				}
			},
			// Initial responsive start canvas size and scales
			initresize() {
				if (document.getElementById("workspace").offsetWidth / document.getElementById("workspace").offsetHeight >= this.ratio) {
					var w = document.getElementById("workspace").offsetHeight * this.ratio;
					var h = document.getElementById("workspace").offsetHeight;
				} else {
					var w = document.getElementById("workspace").offsetWidth;
					var h = document.getElementById("workspace").offsetWidth / this.ratio;
				}
				vm.renderer_client.view.style.width = w + 'px';
				vm.renderer_client.view.style.height = h + 'px';
				vm.scale = 100;
				vm.resize();
				//	this.scale = Math.round(Math.round(w / this.size[0] * 100) / 10) * 10
			},
			resize() {
				if (document.getElementById("workspace").offsetWidth / document.getElementById("workspace").offsetHeight >= this.ratio) {
					var w = document.getElementById("workspace").offsetHeight * this.ratio;
					var h = document.getElementById("workspace").offsetHeight;
				} else {
					var w = document.getElementById("workspace").offsetWidth;
					var h = document.getElementById("workspace").offsetWidth / this.ratio;
				}
				var actual_ratio = this.size[0] / w
					//w = w *3.934426229508197;  4 - 100% , 25% - x?
					//h = h *3.934426229508197;
				w = w * (this.scale * actual_ratio / 100);
				h = h * (this.scale * actual_ratio / 100);
				vm.renderer_client.view.style.width = w + 'px';
				vm.renderer_client.view.style.height = h + 'px';
			},

			updateValue(e) {
				//	var bgcolor = 'rgba(' + this.backgroundcolor.rgba.r + ',' + this.backgroundcolor.rgba.g + ',' + this.backgroundcolor.rgba.b + ',' + this.backgroundcolor.rgba.a + ')';
				//	document.getElementById("canvas").style.backgroundColor = bgcolor;
				vm.background_gradient.alpha = 0;
				vm.colorsstack = [];
				vm.scene_background.tint = vm.rgb2hex([vm.backgroundcolor.rgba.r, vm.backgroundcolor.rgba.g, vm.backgroundcolor.rgba.b]);
				vm.scene_background.alpha = vm.backgroundcolor.rgba.a;

				vm.iconfill='background-color:rgba(' + vm.backgroundcolor.rgba.r + ',' + vm.backgroundcolor.rgba.g + ',' + vm.backgroundcolor.rgba.b + ',' + vm.backgroundcolor.rgba.a + ')';


			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			backward() {
				if (vm.currentframe > 0) vm.currentframe = vm.currentframe - 1;
			},
			forward() {
				if (vm.currentframe < vm.scenestore.s_frames) vm.currentframe = vm.currentframe + 1;
			},
			// Press play button
			play() {
				//"END Position" patch
				if (vm.currentframe == vm.scenestore.s_frames) {
					vm.currentframe = 0;
					for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
						vm.mockup_object_blink[layersindex].gotoAndPlay(vm.currentframe);
						vm.mockup_object[layersindex].gotoAndPlay(vm.currentframe);
					}
					//	vm.cover_object.texture.baseTexture.source.currentTime = vm.currentframe / vm.frameRate
					//	vm.cover_object.texture.baseTexture.source.play();
					//vm.cover_object.gotoAndPlay(vm.currentframe);
					//vm.mask_object.gotoAndPlay(vm.currentframe);
				}
				if (vm.playing == true) {
					vm.playing = false;
					vm.playbutton = "icon-2";
				} else {
					vm.playbutton = "icon-Stop";
					vm.playing = true;
				}
			},
			textdrawactive() {
				var set = [];
				document.getElementById("canvas").style.cursor = "text";
				vm.idscope++;
				vm.layers.unshift({
					id: vm.idscop,
					removable: true,
					icon: 'icon-Stop',
					title: 'Text',
					hidden: false,
					controller: 'text'
				});
				_.transform(vm.toolbars, function(result, key) {
					result.push(key + 1)
				}, set);
				vm.toolbars = set;
				vm.toolbars.unshift(0);
			},
			removelayer(index) {
				var set = [];
				vm.layers.splice(index, 1);
				_.transform(vm.toolbars, function(result, key) {
					if (key < index) result.push(key);
					if (key > index) result.push(key - 1)
				}, set);
				vm.toolbars = set;
			},
			togglevisibility(index) {},
		}
	})
	/* Global events handlers */
window.addEventListener('keydown', function(e) {
	vm.handleGlobalKeyDown(e)
});
window.addEventListener('keyup', function(e) {
	vm.handleGlobalKeyUp(e)
});
window.addEventListener('mousewheel', function(e) {
	vm.handleGlobalMouseWheel(e)
});
window.addEventListener('mousemove', function(e) {
	vm.handleGlobalMouseMove(e)
});
window.addEventListener('mouseup', function(e) {
	vm.handleGlobalMouseUp(e)
});
window.addEventListener('mousedown', function(e) {
	vm.handleGlobalMouseDown(e)
});
window.addEventListener('onselectstart', function(e) {
	return false;
});
