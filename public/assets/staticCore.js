var renderStaticCore = {
    data: {
        scaleValue: 5,
        isTransparent: false,
        uploaderIcon: null,
        isTypeText: false,
        activeChangeableDevice: [],
        changeableDeviceColor: ``,
        isMockupMove1: false,
        isMockupOver: false,
        isMockupSelect: [false, false, false],
        dlgMockupUploader: false,
        quad: [],
        quad_origin: [],
        activeWhiteClayDevice: [],
        hasShadow: false,
        //texture_cover: '',
        //texture_cover_mask: '',
        //texture_cover_distort: '',
        //texture_cover_distort_mask: '',
        mask_object: [],
        cover_object: [],
        covershadow: [],
        shadow_opacity: 1,
        shadow_object: [],
        shadowOpacity: 1,
        current_device: [],
        currentMockup: {},
        scene_mask: new PIXI.Graphics(),
        mask_container: new PIXI.Container(),
        scene_background: new PIXI.Graphics(),
        background_gradient: new PIXI.Sprite(),
        scene_gradient: new PIXI.Container(),
        scene_bgimage: new PIXI.Container(),
        global_project: [],
        distort_layers: [],
        changeableDeviceColor: [],
        mockup_blink_layers: [],
        mockup_object_blink_screen_layers: [],
        shadow_blend_mode: PIXI.BLEND_MODES.NORMAL,
        blend_mode: PIXI.BLEND_MODES.SCREEN,
        renderTextureCover: [],
        renderTextureMask: [],
        hiResTextureMockup: [],
        loResTextureMockup: [],
        coversequence : [],
        isHiResTextureLoaded: true,
        isHiResTexturePreload: false,
        hiResLastId: 0,
        FLAG_MOCKUP_UPDATED: false,
        FLAG_MOCKUPBLINK_UPDATED: false,
        texturePreload: false,
        frameRate: 30,
        CurrentVideoFrame: 0,

        mockup_object: [],
        mockup_object_blink: [],
        basepreloading: 0,
        preloadingcomlite: false,
        effectgamma: 0,
        effectsaturation:0,
        effectcontrast: 0,
        effectbrightness: 0,
        devicesFilters: [],
        effectnoise: 0,
        effectpixilate: 1,
        effectnoisesize: 0.001,
        currentMockup: false,
        iscover : true,
        cover_width: 0,
        cover_height: 0,
        cover_size_style: '',
        cover_upsize_style: '',
        cover_recommended: '',
        //loadedpercent : 0,
        scaled_quad: []
    },
    methods: {
        //**********************************************************************//
        //											   	PIXI CLIENT ENGINE  START						  			//
        //**********************************************************************//
        destroyRender(renderindex) {
            vm.renderer_client.destroy(true)
        },
        // Метод для проверки ретины
        isRetinaDisplay() {
            if (window.matchMedia) {
                var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
                return (mq && mq.matches || (window.devicePixelRatio > 1));
            }
        },
        setPoint(x, y) {
            var square = new PIXI.Sprite(PIXI.Texture.WHITE);
            //square.tint = 0xff0000;
            square.factor = 1;
            //square.anchor.set(0.5);
            square.position.set(x, y);
            return square;
        },
        changeShadowBlending(blendValue) {
            for(let value in PIXI.BLEND_MODES) {
                if(value == blendValue) {
                    vm.shadow_blend_mode = PIXI.BLEND_MODES[value]
                }
            }
        },
        changeDevice(device, index) {
            let devices = vm.scenestore.s_layers[index].l_data

            for(let i = 0; i < devices.length; i++) {
                if(device.i_img_title == devices[i].i_img_title) {
                    vm.current_device[index] = devices[i]
                }
            }

            if(vm.current_device[index].i_img_title == "White Clay") {
                vm.activeWhiteClayDevice[index] = true
            }else vm.activeWhiteClayDevice[index] = false

            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                vm.mockup_object[layersindex].texture = new PIXI.Texture.fromImage(`${vm.size[0]}/${vm.size[1]}/${vm.current_device[layersindex].i_img_uri}`)
                vm.mockup_object_blink[layersindex].texture = (new PIXI.Texture.fromImage(`${vm.size[0]}/${vm.size[1]}/${vm.current_device[layersindex].i_img_uri}`))
            }

        },
        // Предзагрзчик текстур высокого разрешения (разрешения для экспорта видео)
        preloadHiRes(xx) {

            vm.exportratio = vm.origsize[0] / vm.exportsize[0];
            vm.hiResPreloadPercentVid = 0;
            var index;
            var layersindex;
            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                vm.quad_origin[layersindex] = [];
                vm.hiResTextureMockup[layersindex] = [];
            }

            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                //vm.cover_object[layersindex]
                let coversequencetpl = new PIXI.projection.Sprite2d(new PIXI.Texture.fromImage(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/' + 'screen.jpg', true, PIXI.SCALE_MODES.LINEAR));
                //let shadow = new PIXI.Sprite(new PIXI.Texture.fromImage(`${vm.scenestore.s_uri}${vm.scenestore.s_layers[layersindex].l_id}/Shadow/${vm.size[0]}/${vm.size[1]}/Shadow.png`))
                for (index = 0; index < vm.scenestore.s_frames; index++) {
                    /*vm.coversequence[layersindex].push(coversequencetpl);
                    vm.covershadow[layersindex].push(shadow)
                    vm.covershadow[layersindex].blendMode = PIXI.BLEND_MODES.NORMAL*/
                }
                vm.mask_object[layersindex] = new PIXI.projection.Sprite2d(new PIXI.Texture.fromImage(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/mask/' + 'mask.png', true, PIXI.SCALE_MODES.LINEAR));
            }

            for (index = 0; index < vm.scenestore.s_frames; index++) {
                for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                    if (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft !== false) {
                        let offsetx = 0 - vm.scenestore.s_layers[layersindex].l_data[index].i_offset.x;
                        let offsety = 0 - vm.scenestore.s_layers[layersindex].l_data[index].i_offset.y;
                        let obj_origin = [
                            vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.x) / vm.exportratio, (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.y) / vm.exportratio),
                            vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.x ) / vm.exportratio, (vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.y ) / vm.exportratio),
                            vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.x ) / vm.exportratio, (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.y ) / vm.exportratio),
                            vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.x ) / vm.exportratio, (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.y ) / vm.exportratio),
                        ];
                        vm.quad_origin[layersindex].push(obj_origin.map(function(s) {
                            return s.position
                        }));
                    } else {
                        vm.quad_origin[layersindex].push([vm.setPoint(0, 0), vm.setPoint(1, 0), vm.setPoint(1, 1), vm.setPoint(0, 1)].map(function(s) {
                            return s.position
                        }));
                    }
                }
            }
            var buttonWidth = document.getElementById('export-video').offsetWidth
            if (vm.exportsize[0] == vm.size[0]) {
                for (index = 0; index < vm.scenestore.s_frames; index++) {
                    for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                        vm.hiResTextureMockup[layersindex][index] = new PIXI.Texture.fromImage(`${vm.current_device.i_img_uri}`);
                        //console.log(vm.hiResTextureMockup[layersindex][index]);
                        vm.hiResLastId++;
                        vm.hiResPreloadPercentVid = Math.round((vm.hiResLastId) / (vm.scenestore.s_frames*vm.scenestore.s_mcount) * 100)
                        let bproccess = Math.round((vm.hiResLastId / (vm.scenestore.s_frames * vm.scenestore.s_mcount)) * buttonWidth);
                        document.getElementById('export-video').style.boxShadow = "inset " + bproccess + "px 0px 0px 0px #e70000"
                    }
                }
                //vm.hiResLastId = vm.scenestore.s_frames * vm.scenestore.s_mcount;
                //document.getElementById('export-video').style.boxShadow = "inset " + buttonWidth + "px 0px 0px 0px #e70000"
            } else
                for (index = 0; index < vm.scenestore.s_frames; index++) {
                    for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                        vm.hiResTextureMockup[layersindex][index] = new PIXI.Texture.fromImage(`${vm.current_device.i_img_uri}`);
                        //console.log(vm.hiResTextureMockup[layersindex][index]);
                        vm.hiResTextureMockup[layersindex][index].on('update', function() {
                            vm.hiResLastId++;
                            vm.hiResPreloadPercentVid = Math.round((vm.hiResLastId) / (vm.scenestore.s_frames*vm.scenestore.s_mcount) * 100)
                            let bproccess = Math.round((vm.hiResLastId / (vm.scenestore.s_frames * vm.scenestore.s_mcount)) * buttonWidth);
                            document.getElementById('export-video').style.boxShadow = "inset " + bproccess + "px 0px 0px 0px #e70000"
                        });
                    }
                }
        },
        // Метод для открытия окна загрузки изображения на слой
        openUploader(indexofplayer){
            vm.isMockupMove1 = true;
            vm.currentMockup = indexofplayer;
            vm.cover_width = 200;
            vm.cover_height = vm.cover_width / vm.scenestore.s_layers[indexofplayer].l_cover_ratio;
            vm.cover_size_style = 'width:'+vm.cover_width+'px;height:'+vm.cover_height+'px;top:-'+vm.cover_height+'px;'
            vm.cover_upsize_style = 'height:'+vm.cover_height+'px';
            vm.cover_recommended = vm.scenestore.s_layers[indexofplayer].l_mask_width+ 'x' +vm.scenestore.s_layers[indexofplayer].l_mask_height;
            //vm.dlgMockupUploader = true;
            vm.staticDeviceDialog = true;
        },
        // Основной метод сборки сцены
        renderScene(width, height) {

            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                vm.changeableDeviceColor[layersindex] =  0xff5000
                vm.activeWhiteClayDevice[layersindex] = false
                vm.activeChangeableDevice[layersindex] = false
                vm.current_device[layersindex] = vm.scenestore.s_layers[layersindex].l_data[0]
                vm.devicesFilters[layersindex] = {
                    effectgamma: 0,
                    effectsaturation:0,
                    effectcontrast: 0,
                    effectbrightness: 0,
                }
            }

            vm.size[0] = width
            vm.size[1] = height

            //vm.userExportSize = [width, height]

            vm.origratio = vm.origsize[0] / vm.origsize[1]
            vm.reduceratioX = vm.origsize[0] / (vm.size[0] * vm.scaleValue)
            vm.reduceratioY = vm.origsize[1] / ( vm.size[1] * vm.scaleValue)

            var frames = vm.scenestore;
            vm.ratio = vm.size[0] / vm.size[1];
            PIXI.utils.skipHello()
            //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
            // Init PIXI Application
            while (vm.hiResTextureMockup.length) {
                vm.hiResTextureMockup.pop();
            }
            while (vm.loResTextureMockup.length) {
                vm.loResTextureMockup.pop();
            }
            while (vm.length) {
                vm.quad_origin.pop();
            }
            while (vm.quad.length) {
                vm.quad.pop();
            }
            while (vm.scaled_quad.length) {
                vm.scaled_quad.pop();
            }
            vm.quad.length = 0;
            vm.scaled_quad.length = 0
            vm.quad_origin.length = 0;
            vm.loResTextureMockup.length = 0;
            vm.hiResTextureMockup.length = 0;
            if (vm.renderer_client != null) {
                vm.renderer_client.ticker.stop();
                for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                    vm.mockup_object_blink[layersindex].destroy(true);
                    vm.distort_layers[layersindex].destroy(true)
                    vm.mockup_object[layersindex].destroy(true);
                }

                vm.renderer_client.destroy(true, true);
                vm.mask_container.destroy(true);
            }
            vm.renderer_client = new PIXI.Application({
                width: vm.size[0],
                height: vm.size[1],
                view: document.getElementById('canvas'),
                transparent: true,
                resolution: 2, //(vm.isRetinaDisplay()) ? 2 : 1,
                antialias: true,
                powerPreference: "high-performance",
                autoResize:true
            });
            vm.renderer_client.renderer.plugins.interaction.moveWhenInside = true;
            var loader = new PIXI.loaders.Loader();
            // Init graphics
            vm.scene_background.lineStyle(1, 0xFFFFFF, 1);
            vm.scene_background.beginFill((0xFFFFFF), 1);
            vm.scene_background.drawRect(0, 0, vm.size[0], vm.size[1]);
            vm.scene_background.endFill();
            vm.renderer_client.stage.addChild(vm.scene_background);
            vm.renderer_client.stage.addChild(vm.background_gradient);

//===============================================
            vm.scene_mask.lineStyle(1, 0x000000, 1);
            vm.scene_mask.beginFill((0x000000), 1);
            vm.scene_mask.drawRect(0, 0, vm.size[0], vm.size[1]);
            vm.scene_mask.endFill();


//===============================================

            // Just for test
            var index;
            var layersindex;

            vm.uploaderIcon = new PIXI.Sprite.fromImage(`/images/icons/upload2.svg`)

            var coversequence=[];
            // Init data
            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                vm.loResTextureMockup[layersindex] = [];
                vm.coversequence[layersindex] = [];
                vm.covershadow[layersindex] = []
                vm.quad[layersindex] = [];
                vm.scaled_quad[layersindex] = []
                vm.distort_layers[layersindex] = new PIXI.Container();
                vm.mockup_blink_layers[layersindex] = new PIXI.Container();
                vm.mockup_object_blink_screen_layers[layersindex] = new PIXI.Container();
            }
            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                loader.add(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/' + 'screen.jpg');
                loader.add(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/mask/' + 'mask.png');
                /*for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                    loader.add(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/device/' + vm.size[0] + '/' + vm.size[1] + '/' + vm.scenestore.s_layers[layersindex].l_data[0].i_img_uri);
                }*/
            }
            loader.onProgress.add((x) => {
                vm.basepreloading = parseInt(x.progress);
            });
            loader.onComplete.add(() => {
                vm.preloadingcomlite = true
            });
            loader.load(function(loader, resources) {
                for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                    let coversequencetpl = new PIXI.projection.Sprite2d(new PIXI.Texture.fromImage(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/' + 'screen.jpg', true, PIXI.SCALE_MODES.LINEAR));
                    let shadow
                    if(vm.hasShadow) shadow = new PIXI.Sprite(new PIXI.Texture.fromImage(`${vm.scenestore.s_uri}${vm.scenestore.s_layers[layersindex].l_id}/Shadow/${vm.size[0]}/${vm.size[1]}/Shadow.png`))
                    for (index = 0; index < vm.scenestore.s_frames; index++) {
                        vm.coversequence[layersindex].push(coversequencetpl);
                        if(vm.hasShadow){
                            vm.covershadow[layersindex].push(shadow)
                            vm.covershadow[layersindex].blendMode = PIXI.BLEND_MODES.NORMAL
                        }
                    }
                    vm.mask_object[layersindex] = new PIXI.projection.Sprite2d(new PIXI.Texture.fromImage(vm.scenestore.s_uri + vm.scenestore.s_layers[layersindex].l_id + '/mask/' + 'mask.png', true, PIXI.SCALE_MODES.LINEAR));
                }
                for (index = 0; index < vm.scenestore.s_frames; index++) {
                    for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                        vm.loResTextureMockup[layersindex][index] = new PIXI.Texture.fromImage(`${vm.size[0]}/${vm.size[1]}/${vm.current_device[layersindex].i_img_uri}`);
                        if (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft !== false) {
                            let obj = [
                                vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.x) / vm.reduceratioX, (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.y) / vm.reduceratioY),
                                vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.x) / vm.reduceratioX, (vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.y) / vm.reduceratioY),
                                vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.x) / vm.reduceratioX, (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.y) / vm.reduceratioY),
                                vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.x) / vm.reduceratioX, (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.y) / vm.reduceratioY),
                            ];
                            vm.quad[layersindex].push(obj.map(function(s) {
                                return s.position
                            }));
                        } else {
                            vm.quad[layersindex].push([vm.setPoint(0, 0), vm.setPoint(1, 0), vm.setPoint(1, 1), vm.setPoint(0, 1)].map(function(s) {
                                return s.position
                            }));
                        }
                    }
                }

              /*  for (index = 0; index < vm.scenestore.s_frames; index++) {
                    for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                        vm.loResTextureMockup[layersindex][index] = new PIXI.Texture.fromImage(`${vm.size[0]}/${vm.size[1]}/${vm.current_device[layersindex].i_img_uri}`);
                        if (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft !== false) {
                            let obj = [
                                vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.x) / (vm.reduceratioX/4), (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.y) / (vm.reduceratioY/4)),
                                vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.x) / (vm.reduceratioX/4), (vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.y) / (vm.reduceratioY/4)),
                                vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.x) / (vm.reduceratioX/4), (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.y) / (vm.reduceratioY/4)),
                                vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.x) / (vm.reduceratioX/4), (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.y) / (vm.reduceratioY/4)),
                            ];
                            vm.scaled_quad[layersindex].push(obj.map(function(s) {
                                return s.position
                            }));
                        } else {
                            vm.scaled_quad[layersindex].push([vm.setPoint(0, 0), vm.setPoint(1, 0), vm.setPoint(1, 1), vm.setPoint(0, 1)].map(function(s) {
                                return s.position
                            }));
                        }
                    }
                }*/
                for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                    // Loading sequences
                    vm.mockup_object[layersindex] = new PIXI.extras.AnimatedSprite(vm.loResTextureMockup[layersindex]);
                    vm.mockup_object[layersindex].scale.set(2)
                    vm.mockup_object[layersindex].texture.cacheAsBitmap = true;
                    vm.mockup_object[layersindex].scale.set(1)

                    vm.mockup_object_blink_screen_layers[layersindex] = new PIXI.extras.AnimatedSprite(vm.loResTextureMockup[layersindex]);
                    vm.mockup_object_blink[layersindex] = new PIXI.extras.AnimatedSprite(vm.loResTextureMockup[layersindex]);
                    vm.cover_object[layersindex] = vm.coversequence[layersindex][0];
                    if(vm.hasShadow){
                        vm.shadow_object[layersindex] = vm.covershadow[layersindex][0]
                        vm.shadow_object[layersindex].width = vm.size[0]
                        vm.shadow_object[layersindex].height = vm.size[1]
                    }

                }

                var smart = new PIXI.Container()

                var centerRect = []
                var squaresRect = []
                var minX = []
                var minY = []
                var maxW = []
                var maxH = []
                var maxArea = [];
                var padding = 30
                for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                    /////////////////////////////////////////////
                    centerRect[layersindex] = []
                    squaresRect[layersindex] = []
                    minX[layersindex] = []
                    minY[layersindex] = []
                    maxW[layersindex] = []
                    maxH[layersindex] = []
                    for (index = 0; index < vm.scenestore.s_frames; index++) {
                        let a = Math.sqrt(Math.abs(Math.pow(vm.quad[layersindex][index][1].x - vm.quad[layersindex][index][0].x, 2) + Math.pow(vm.quad[layersindex][index][1].y - vm.quad[layersindex][index][0].y, 2)));
                        let b = Math.sqrt(Math.abs(Math.pow(vm.quad[layersindex][index][2].x - vm.quad[layersindex][index][1].x, 2) + Math.pow(vm.quad[layersindex][index][2].y - vm.quad[layersindex][index][1].y, 2)));
                        let c = Math.sqrt(Math.abs(Math.pow(vm.quad[layersindex][index][3].x - vm.quad[layersindex][index][2].x, 2) + Math.pow(vm.quad[layersindex][index][3].y - vm.quad[layersindex][index][2].y, 2)));
                        let d = Math.sqrt(Math.abs(Math.pow(vm.quad[layersindex][index][0].x - vm.quad[layersindex][index][3].x, 2) + Math.pow(vm.quad[layersindex][index][0].y - vm.quad[layersindex][index][3].y, 2)));
                        let p = (a + b + c + d) / 2;
                        let s = Math.sqrt((p - a) * (p - b) * (p - c) * (p - d));
                        squaresRect[layersindex].push(s);
                        maxArea[layersindex] = _.max(squaresRect[layersindex]);
                        let x1 = vm.quad[layersindex][index][0].x;
                        let y1 = vm.quad[layersindex][index][0].y;
                        let x2 = vm.quad[layersindex][index][2].x;
                        let y2 = vm.quad[layersindex][index][2].y;
                        let x3 = vm.quad[layersindex][index][1].x;
                        let y3 = vm.quad[layersindex][index][1].y;
                        let x4 = vm.quad[layersindex][index][3].x;
                        let y4 = vm.quad[layersindex][index][3].y;
                        let x = -((x1 * y2 - x2 * y1) * (x4 - x3) - (x3 * y4 - x4 * y3) * (x2 - x1)) / ((y1 - y2) * (x4 - x3) - (y3 - y4) * (x2 - x1));
                        let y = ((y3 - y4) * (-x) - (x3 * y4 - x4 * y3)) / (x4 - x3);
                        centerRect[layersindex][index] = {
                            "x": x,
                            "y": y
                        };
                        let min_X = _.min([vm.quad[layersindex][index][0].x, vm.quad[layersindex][index][1].x, vm.quad[layersindex][index][2].x, vm.quad[layersindex][index][3].x]) - padding
                        let min_Y = _.min([vm.quad[layersindex][index][0].y, vm.quad[layersindex][index][1].y, vm.quad[layersindex][index][2].y, vm.quad[layersindex][index][3].y]) - padding
                        minX[layersindex][index] = min_X;
                        minY[layersindex][index] = min_Y;
                        maxW[layersindex][index] = _.max([vm.quad[layersindex][index][0].x, vm.quad[layersindex][index][1].x, vm.quad[layersindex][index][2].x, vm.quad[layersindex][index][3].x]) + padding - min_X;
                        maxH[layersindex][index] = _.max([vm.quad[layersindex][index][0].y, vm.quad[layersindex][index][1].y, vm.quad[layersindex][index][2].y, vm.quad[layersindex][index][3].y]) + padding - min_Y;
                    }
                    ///////////////////////////////////////////
                    vm.mockup_object[layersindex].loop = false;
                    vm.mockup_object[layersindex].animationSpeed = 0.5;
                    vm.mockup_object_blink[layersindex].loop = false;
                    vm.mockup_object_blink[layersindex].animationSpeed = 0.5;
                    vm.mockup_object_blink[layersindex].blendMode = vm.blend_mode;
                    vm.mockup_object_blink_screen_layers[layersindex].blendMode = PIXI.BLEND_MODES.SCREEN

//=======================================

                    /*console.log(vm.quad[layersindex][vm.currentframe])
                    var texture_cover_mask_distort = new PIXI.projection.Sprite2d(vm.cover_object[layersindex].texture)
                    var texture_cover_mask_distort_bg = new PIXI.projection.Sprite2d(vm.cover_object[layersindex].texture)
                    texture_cover_mask_distort.texture = PIXI.Texture.WHITE
                    //texture_cover_mask_distort_bg.tint = 0x000000
                    texture_cover_mask_distort.proj.mapSprite(texture_cover_mask_distort, vm.quad[layersindex][vm.currentframe])
                    vm.mask_container.addChild(vm.scene_mask)
                    vm.mask_container.addChild(texture_cover_mask_distort)
                    var maskcoverb64 = vm.renderer_client.renderer.extract.base64(vm.mask_container)
                    var maskcover = new PIXI.projection.Sprite2d(new PIXI.Texture.fromImage(maskcoverb64))
                    maskcover.scale.set(1/1.5)*/

//=======================================

                    var texture_cover_distort_mask = new PIXI.projection.Sprite2d(vm.mask_object[layersindex].texture);
                    var renderTextureMask = PIXI.RenderTexture.create(vm.size[0] * vm.scaleValue, vm.size[1] * vm.scaleValue);
                    texture_cover_distort_mask.proj.mapSprite(texture_cover_distort_mask, vm.quad[layersindex][0]);
                    vm.renderer_client.renderer.render(texture_cover_distort_mask, renderTextureMask);
                    var mask_layer = new PIXI.Sprite(renderTextureMask)
                    mask_layer.cacheAsBitmap = true
                    mask_layer.scale.set(1/vm.scaleValue)

                    vm.cover_object[layersindex].scale.set(1/vm.scaleValue)
                    vm.mask_object[layersindex].scale.set(1/vm.scaleValue)

                    vm.cover_object[layersindex].texture.baseTexture.mipmap=false;
                    vm.distort_layers[layersindex].addChild(vm.cover_object[layersindex]);
                    vm.distort_layers[layersindex].addChild(vm.mockup_object_blink[layersindex]);
                    vm.distort_layers[layersindex].addChild(mask_layer);
                    vm.distort_layers[layersindex].mask = mask_layer

                    var container = new PIXI.Container()
                    container.addChild(vm.distort_layers[layersindex])
                    container.addChild(vm.mask_object[layersindex])
                    container.mask= vm.mask_object[layersindex]

                    container.interactive = true;
                    container.buttonMode = true;
                    container.moveWhenInside = false;
                    container.indexoflayer = layersindex
                    container
                        .on('click', function() {
                            vm.openUploader(this.indexoflayer);
                        })
                        .on('mouseover', function(event) {
                            vm.isMockupOver = this.indexoflayer;
                            this.filters = [new PIXI.filters.AdjustmentFilter({
                                saturation: 0
                            })];
                            vm.uploaderIcon.position.set((centerRect[vm.isMockupOver][vm.currentframe].x / vm.scaleValue) - 29.5, (centerRect[vm.isMockupOver][vm.currentframe].y / vm.scaleValue) - 29.5)
                            //smart.destroy(true);
                            /*smart.beginFill(0xFFFFFF, 0.2);
                            smart.lineStyle(2, 0xff9c00);
                            smart.drawCircle(centerRect[vm.isMockupOver][vm.currentframe].x, centerRect[vm.isMockupOver][vm.currentframe].y, 40);
                            smart.moveTo(centerRect[vm.isMockupOver][vm.currentframe].x, centerRect[vm.isMockupOver][vm.currentframe].y - 25)
                            smart.lineTo(centerRect[vm.isMockupOver][vm.currentframe].x, centerRect[vm.isMockupOver][vm.currentframe].y + 25)
                            smart.moveTo(centerRect[vm.isMockupOver][vm.currentframe].x - 25, centerRect[vm.isMockupOver][vm.currentframe].y)
                            smart.lineTo(centerRect[vm.isMockupOver][vm.currentframe].x + 25, centerRect[vm.isMockupOver][vm.currentframe].y)*/
                            smart.addChild(vm.uploaderIcon)
                            /*smart.closePath();
                            smart.endFill();*/
                        })
                        .on('mouseout', function(event) {
                            this.filters = [];
                            if (vm.isMockupOver === this.indexoflayer)
                                smart.removeChild(vm.uploaderIcon)
                            //smart.destroy(true);
                        });

                    vm.global_project[layersindex] = new PIXI.Container()
                    if(vm.hasShadow) vm.global_project[layersindex].addChild(vm.shadow_object[layersindex]);
                    vm.global_project[layersindex].addChild(vm.mockup_object[layersindex]);
                    vm.global_project[layersindex].addChild(container);
                }

                for (var v = 0; v < 4; v++) vm.rubberband.push({
                    x: -1,
                    y: -1
                });
                for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                    vm.renderer_client.stage.addChild(vm.global_project[layersindex]);
                    //vm.renderer_client.stage.addChild(vm.distort_layers[layersindex]);
                    //vm.renderer_client.stage.addChild(vm.tool_selector);
                    // INTERACTIVE
                    //	vm.mockup_object[layersindex].interactive = true;
                    /*
                                        vm.global_project
                                            .on('mousedown', onDragStart)
                                            .on('mouseup', onDragStop)
                                            .on('mousemove', onDragMove)
                                            */
                    //	vm.isHiResTextureNext = false;
                    //	vm.texturePreload = new PIXI.Texture.fromImage(vm.scenestore.s_uri + layer + '/device/4096/2160/' + vm.scenestore.s_layers[0].l_data[vm.hiResLastId++].i_img_uri)
                    //	vm.mockup_object.texture.on('update', function() {
                    //		vm.FLAG_MOCKUP_UPDATED = true;
                    //	})
                    //	vm.mockup_object_blink.texture.on('update', function() {
                    //		vm.FLAG_MOCKUPBLINK_UPDATED = true;
                    //	})
                }
                vm.renderer_client.stage.addChild(smart);
                // STARTUP ACTIONS
                vm.initresize();
                var loadedframe = 0;
                var loadcounter = 0;
                PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
                var iop = vm.renderer_client.ticker.add(function(deltaTime) {
                    //var current_frame = vm.currentframe;

                    vm.renderer_client.stage.filters = [new PIXI.filters.FXAAFilter()]

                    for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {



                        if(vm.hasShadow) vm.shadow_object[layersindex].blendMode = vm.shadow_blend_mode

                        vm.global_project[layersindex].filters = [new PIXI.filters.AdjustmentFilter({
                            gamma: vm.devicesFilters[layersindex].effectgamma+1 ,
                            contrast:  vm.devicesFilters[layersindex].effectcontrast+1,
                            saturation:  vm.devicesFilters[layersindex].effectsaturation+1,
                            brightness:  vm.devicesFilters[layersindex].effectbrightness+1,
                        })];

                        if(vm.activeWhiteClayDevice[layersindex]) {
                            //vm.distort_layers[layersindex].addChild(vm.mockup_object_blink_screen_layers[layersindex]);
                            vm.mockup_object_blink[layersindex].blendMode = PIXI.BLEND_MODES.MULTIPLY
                        }else  {
                            //vm.distort_layers[layersindex].removeChild(vm.mockup_object_blink_screen_layers[layersindex])
                            vm.mockup_object_blink[layersindex].blendMode = vm.blend_mode
                        }

                        if(vm.activeChangeableDevice[layersindex]) {
                            vm.mockup_object[layersindex].tint = vm.changeableDeviceColor[layersindex]
                            vm.mockup_object_blink[layersindex].tint = 16777215
                        }else {
                            vm.mockup_object[layersindex].tint = 16777215
                            vm.mockup_object_blink[layersindex].tint = 16777215
                        }
                        //настройка изменения прозрачности тени
                        if(vm.hasShadow)vm.shadow_object[layersindex].alpha = vm.shadow_opacity

                    }

                    vm.renderer_client.stage.filters = [new PIXI.filters.AdjustmentFilter({
                        gamma: vm.effectgamma+1 ,
                        contrast:  vm.effectcontrast+1,
                        saturation:  vm.effectsaturation+1,
                        brightness:  vm.effectbrightness+1,
                    })
                        /*
                        ,new PIXI.filters.OldFilmFilter({
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
                        new PIXI.filters.PixelateFilter(vm.effectpixilate)
                        */

                    ];





                    if (vm.currentframe >= vm.loadedframe) {

                        vm.currentframe = vm.loadedframe - vm.prebufferframes;
                        if (vm.currentframe < 0) vm.currentframe = 0;
                        for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                            vm.mockup_object_blink[layersindex].stop(vm.currentframe);
                            vm.mockup_object[layersindex].stop(vm.currentframe);
                            vm.playing = false;
                            vm.playbutton = "icon-2";
                        }
                        //	vm.cover_object.texture.baseTexture.source.pause();
                        //	vm.cover_object.texture.baseTexture.source.currentTime = vm.currentframe / vm.frameRate
                    }
                    //Tools rubber band
                    //	vm.tool_selector.clear();
                    //	vm.tool_selector.lineStyle(1, 0x000000, 0.7);
                    //	var offsetInterval = 150;
                    //	vm.tool_selector.drawDashedPolygon(vm.rubberband, 0, 0, 0, 5, 5, (Date.now() % offsetInterval + 1) / offsetInterval);
                    // CHECK PLAY STATE
                    if (vm.playing === true) {
                        for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                            vm.mockup_object_blink[layersindex].play();
                            vm.mockup_object[layersindex].play();
                        }
                        //	vm.cover_object.texture.baseTexture.source.play();
                    } else {
                        for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                            vm.mockup_object_blink[layersindex].gotoAndStop(vm.currentframe);
                            vm.mockup_object[layersindex].gotoAndStop(vm.currentframe);
                        }
                        //		vm.cover_object.texture.baseTexture.source.pause();
                        //		vm.cover_object.texture.baseTexture.source.currentTime = vm.currentframe / vm.frameRate
                    }
                    vm.currentframe = _.max([vm.mockup_object[0].currentFrame, vm.mockup_object_blink[0].currentFrame])
                    for (i = 1; i < vm.scenestore.s_mcount; i++) {
                        if (vm.currentframe > _.max([vm.mockup_object[i].currentFrame, vm.mockup_object_blink[i].currentFrame]))
                            vm.currentframe = _.max([vm.mockup_object[i].currentFrame, vm.mockup_object_blink[i].currentFrame])

                    }
                    //vm.cover_object.texture.baseTexture.source.currentTime = vm.currentframe / vm.frameRate
                    //	vm.cover_object.texture.baseTexture.source.currentTime = vm.currentframe;
                    for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                        //console.log(layersindex)
                        vm.cover_object[layersindex].proj.mapSprite(vm.coversequence[layersindex][vm.currentframe], vm.quad[layersindex][vm.currentframe]);
                        vm.mask_object[layersindex].proj.mapSprite(vm.mask_object[layersindex], vm.quad[layersindex][vm.currentframe]);
                        //	smart.hitArea = new PIXI.Rectangle(minX,minY,maxX,maxY);
                        // BLUR CORRECTION
                        /*if ((squaresRect[layersindex][vm.currentframe] / maxArea[layersindex]) * 100 < 45) {
                            let $blurdelta = (-0.98 * (squaresRect[layersindex][vm.currentframe] / maxArea[layersindex]) + 0.4455) / 0.45;
                            vm.cover_object[layersindex].filters = [new PIXI.filters.BlurFilter($blurdelta, 40)];
                        } else {
                            vm.cover_object[layersindex].filters = [];
                        }*/
                    }
                    //Finalise stop state in non-loop mode

                    if (vm.repeat_btn_state === false && vm.currentframe >= vm.scenestore.s_frames-1) {
                        for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                            vm.currentframe = 0;
                            vm.mockup_object[layersindex].gotoAndStop(0);
                            vm.mockup_object_blink[layersindex].gotoAndStop(0);
                            vm.playing = false;
                            vm.playbutton = "icon-2";
                        }
                    }
                    //Calculate loaded frames
                    for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                        if (vm.loadedframe < vm.scenestore.s_frames && vm.mockup_object[layersindex].textures[vm.loadedframe].baseTexture.hasLoaded == true) {
                            loadcounter++;
                        }
                    }
                    if (loadcounter >= vm.scenestore.s_mcount) {
                        loadcounter = 0;
                        vm.loadedframe++;
                        vm.loadedpercent = vm.loadedframe / vm.scenestore.s_frames * 100
                    }
                    //Hi res preload
                    if (vm.loadedframe >= vm.scenestore.s_frames && !vm.isHiResTexturePreload && !vm.manualModeChange) {
                        vm.isHiResTexturePreload = true;
                        vm.preloadHiRes();
                    }
                    ///////////////////////////////
                    //Do prebuffer if play then loading
                    if (vm.currentframe + vm.prebufferframes > vm.loadedframe && vm.loadedframe != vm.scenestore.s_frames) {
                        if (vm.repeat_btn_state === false) {

                            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                                vm.mockup_object[layersindex].stop();
                                vm.mockup_object_blink[layersindex].stop();
                                vm.playing = false;
                                vm.playbutton = "icon-2";
                            }
                            // vm.cover_object.texture.baseTexture.source.pause();
                            //	vm.cover_object.texture.baseTexture.source.currentTime = vm.currentframe / vm.frameRate
                        } else {
                            vm.currentframe = 0;
                            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                                vm.mockup_object_blink[layersindex].gotoAndPlay(vm.currentframe);
                                vm.mockup_object[layersindex].gotoAndPlay(vm.currentframe);
                            }
                            //					vm.cover_object.texture.baseTexture.source.play();
                        }
                    }
                    vm.formfile.name = 'frame_' + vm.currentframe
                    if (vm.exportFrameEvent !== false) {
                        console.log('Export frame ' + vm.exportFrameEvent)
                        setTimeout(function() {
                            vm.exportToFile(vm.exportType, vm.exportUid, vm.exportFrameEvent)
                        }, 1000)
                        vm.exportFrameEvent = false;
                    }
                })
                // end render event



                iop.minFPS = 1;
                setInterval(function() {
                    if (vm.playing) {

                        vm.fps = Math.round(iop.FPS)

                        if (vm.fps > 30) vm.fps = 30;
                        vm.fpscolor = 'success';
                        //vm.fpswarning = false;

                        if (vm.fps < 30) vm.fpscolor = 'warning';
                        if (vm.fps < 15) {
                            vm.fpscolor = 'danger';

                            if(vm.fpswarning === false){
                                vm.fpswarning = true;
                                /*vm.$notify({
                                     duration: 3000,
                                     customClass : 'notification-box',
                                  message: 'Low perfomance detected, we are strongly recommended dont use any software in background!',
                                  position: 'bottom-right',
                                    onClose: function(){vm.fpswarning = false;}
                                });*/


                            }
                            //vm.fpswarning = true;
                        }
                    } else vm.fps = 0;
                }, 1000)
                // Функции обработки интерактива (в основном для рисования примитивов)
                function onDragStart(event) {
                    var mouseposition = event.data.getLocalPosition(this.parent)
                    vm.isMouseDown = true;
                    if (vm.isMockupSelect[0]) {
                        vm.dlgMockupUploader = true;
                    } else if (vm.usetool != '') {
                        vm.isDraw = true;
                        vm.setRubberBand(-1, -1, -1, -1);
                        if (vm.isDrawCurve === false) {
                            var level_id = vm.addLayer(vm.usetool);
                            vm.layers[0].globject.staticX = mouseposition.x
                            vm.layers[0].globject.staticY = mouseposition.y
                        }
                        if (vm.usetool == 'drawtext') {
                            vm.isTypeText = true;
                            var inputField = new PixiTextInput(mouseposition, "hello", {}, false, false);
                            inputField.x = mouseposition.x
                            inputField.y = mouseposition.y
                            inputField.width = 440
                            vm.renderer_client.stage.addChild(inputField);
                        }
                        if (vm.usetool == 'drawcurve') {
                            vm.drawCurve(
                                mouseposition.x,
                                mouseposition.y,
                                0xFFFFFF,
                                (vm.layers[0].globject.lineColor) ? vm.layers[0].globject.lineColor : 0x000000,
                                (vm.layers[0].globject.lineWidth) ? vm.layers[0].globject.lineWidth : 1,
                                false)
                        }
                        if (vm.usetool == 'drawcircle') {
                            vm.layers[0].globject.beginFill(0xFFFFFF);
                            vm.layers[0].globject.lineStyle(1, 0x000000);
                            vm.layers[0].globject.drawEllipse(0, 0, 1, 1)
                            vm.layers[0].globject.position.set(mouseposition.x, mouseposition.y)
                            vm.layers[0].globject.endFill();
                            vm.renderer_client.stage.addChild(vm.layers[0].globject);
                        }
                        if (vm.usetool == 'drawrect') {
                            vm.layers[0].globject.beginFill(0xFFFFFF);
                            vm.layers[0].globject.lineStyle(1, 0x000000);
                            vm.layers[0].globject.drawRoundedRect(0, 0, 0, 0, 1);
                            vm.layers[0].globject.position.set(mouseposition.x, mouseposition.y)
                            vm.layers[0].globject.endFill();
                            vm.renderer_client.stage.addChild(vm.layers[0].globject);
                        }
                        if (vm.usetool == 'drawstar') {
                            vm.layers[0].globject.beginFill(0xFFFFFF);
                            vm.layers[0].globject.lineStyle(1, 0x000000);
                            vm.layers[0].globject.drawStar(0, 0, 0, 0, 0)
                            vm.layers[0].globject.position.set(mouseposition.x, mouseposition.y)
                            vm.layers[0].globject.endFill();
                            vm.renderer_client.stage.addChild(vm.layers[0].globject);
                        }
                    } else
                    if (!this.dragging && !vm.isHoldSpace) {
                        vm.layer2select = false;
                        for (var v = 0; v < vm.scenestore.s_mcount; v++) {
                            if (mouseposition.x > vm.scenestore.s_layers[v].l_crop[0].x && mouseposition.x < vm.scenestore.s_layers[v].l_crop[1].x && mouseposition.y > vm.scenestore.s_layers[v].l_crop[0].y && mouseposition.y < vm.scenestore.s_layers[v].l_crop[2].y) {
                                console.log('Select mockup from layer ' + v)
                                for (var i = 0; i < 4; i++) vm.rubberband[i] = {
                                    x: vm.scenestore.s_layers[v].l_crop[i].x,
                                    y: vm.scenestore.s_layers[v].l_crop[i].y
                                };
                                vm.objlayer1.x = mouseposition.x;
                                vm.objlayer1.y = mouseposition.y;
                                vm.objlayer1.layerX = vm.global_project.x;
                                vm.objlayer1.layerY = vm.global_project.y;
                                vm.objlayer1.zoneX1 = vm.rubberband[0].x;
                                vm.objlayer1.zoneY1 = vm.rubberband[0].y;
                                vm.objlayer1.zoneX2 = vm.rubberband[2].x;
                                vm.objlayer1.zoneY2 = vm.rubberband[2].y;
                                vm.layer2select = true;
                                this.dragging = true;
                            }
                        }
                        if (vm.layer2select == false) {
                            vm.setRubberBand(mouseposition.x, mouseposition.y, mouseposition.x, mouseposition.y);
                            this.dragging = true;
                        }
                    }
                }

                function onDragStop() {
                    vm.isMouseDown = false;
                    if (vm.isDrawCurve === false) {
                        vm.isDraw = false;
                        vm.usetool = '';
                        vm.isHoldSpace = false;
                        document.getElementById("canvas").style.cursor = "default";
                        vm.edgeHelper(vm.lastEdgeHelper, true, true)
                    }
                    if (this.dragging) {
                        this.dragging = false;
                        this.data = null;
                        if (vm.layer2select == false) {
                            for (var i = 0; i < 4; i++) vm.rubberband[i] = {
                                x: -1,
                                y: -1
                            };
                        } else {
                            store.commit('changeCropZoneTo', {
                                layer: 0,
                                positions: [{
                                    x: vm.rubberband[0].x,
                                    y: vm.rubberband[0].y
                                }, {
                                    x: vm.rubberband[1].x,
                                    y: vm.rubberband[1].y
                                }, {
                                    x: vm.rubberband[2].x,
                                    y: vm.rubberband[2].y
                                }, {
                                    x: vm.rubberband[3].x,
                                    y: vm.rubberband[3].y
                                }

                                ]
                            });
                        }
                    }
                }
                // Преобразование градусов в радианы
                function deg2rad(degrees) {
                    var pi = Math.PI;
                    return degrees * (pi / 180);
                }
                //////////////////////////////////////////////////////////////////
                function onDragMove(event) {
                    //
                    if (vm.isMockupMove1 === true) {
                        document.getElementById("canvas").style.cursor = "pointer";
                        //	vm.distort_layers.alpha = 0.5
                        //	vm.distort_layers.filters = [new PIXI.filters.BlurFilter(0.99, 2)];
                        vm.isMockupSelect[0] = true
                        //console.log(vm.isMockupMove1)
                    } else {
                        document.getElementById("canvas").style.cursor = "default";
                        //	vm.distort_layers.alpha = 1
                        //	vm.distort_layers.filters = [new PIXI.filters.BlurFilter(0.01, 2)];
                        vm.isMockupSelect[0] = false
                        //	console.log(vm.isMockupMove1)
                    }
                    //setTimeout(function(){
                    vm.isMockupMove1 = false;
                    //},500)
                    var mouseposition = event.data.getLocalPosition(this.parent)
                    if (vm.isDraw === true) {
                        if (vm.usetool == 'drawcircle') vm.drawEllipse(mouseposition.x, mouseposition.y, 0xFFFFFF, 0x000000);
                        if (vm.usetool == 'drawrect') vm.drawRoundedRectable(mouseposition.x, mouseposition.y, 0xFFFFFF, 0x000000);
                        if (vm.usetool == 'drawstar') vm.drawStar(mouseposition.x, mouseposition.y, 0xFFFFFF, 0x000000);
                        if (vm.usetool == 'drawcurve' && vm.isDrawCurve === true) vm.drawCurve(mouseposition.x, mouseposition.y, 0xFFFFFF, 0x000000);
                    } else
                    if (this.dragging) {
                        if (vm.layer2select == false) {
                            vm.rubberband[1].x = mouseposition.x;
                            vm.rubberband[2] = {
                                x: mouseposition.x,
                                y: mouseposition.y
                            };
                            vm.rubberband[3].y = mouseposition.y;
                        } else {
                            var offsetx = parseInt(mouseposition.x - vm.objlayer1.x)
                            var offsety = parseInt(mouseposition.y - vm.objlayer1.y)
                            vm.global_project.x = parseInt(vm.objlayer1.layerX) + offsetx
                            vm.global_project.y = parseInt(vm.objlayer1.layerY) + offsety
                            vm.setRubberBand(
                                parseInt(vm.objlayer1.zoneX1) + (offsetx),
                                parseInt(vm.objlayer1.zoneY1) + (offsety),
                                parseInt(vm.objlayer1.zoneX2) + (offsetx),
                                parseInt(vm.objlayer1.zoneY2) + (offsety))
                        }
                    }
                }
            });
        },
        //**********************************************************************//
        //												PIXI  ENGINE	FINISH													//
        //**********************************************************************//
    }
}
