var exportStaticTools = {
    data: {
        userExportSize: [1310, 907],
        hires_mask_object: [],
        hires_cover_object: [],
        hires_covershadow: [],
        hires_shadow_object: [],
        hires_reduceratioX: 0,
        hires_reduceratioY: 0,
        hires_mockup_object: [],
        hires_mockup_object_blink: [],
        hiResTextureMockup: [],
        hires_mockup_object_blink_screen_layers: [],
        hires_scene_mask: new PIXI.Graphics(),
        hires_mask_container: new PIXI.Container(),
        hires_scene_background: new PIXI.Graphics(),
        hires_background_gradient: new PIXI.Sprite(),
        hires_scene_gradient: new PIXI.Container(),
        hires_scene_bgimage: new PIXI.Container(),
        hires_global_project: [],
        hires_distort_layers: [],
        hires_quad: []
    },
    methods: {
        preloadHiresStaticScene() {

            vm.hires_reduceratioX = vm.origsize[0] / vm.userExportSize[0]
            vm.hires_reduceratioY = vm.origsize[1] / vm.userExportSize[1]

            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                vm.hiResTextureMockup[layersindex] = [];
                vm.hires_covershadow[layersindex] = []
                vm.hires_quad[layersindex] = [];
                vm.hires_distort_layers[layersindex] = new PIXI.Container();
                vm.mockup_blink_layers[layersindex] = new PIXI.Container();
                vm.hires_mockup_object_blink_screen_layers[layersindex] = new PIXI.Container();
            }




            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                //vm.cover_object[layersindex]
                let shadow
                if(vm.hasShadow) shadow = new PIXI.Sprite(new PIXI.Texture.fromImage(`${vm.scenestore.s_uri}${vm.scenestore.s_layers[layersindex].l_id}/Shadow/${vm.userExportSize[0]}/${vm.userExportSize[1]}/Shadow.png`))
                for (index = 0; index < vm.scenestore.s_frames; index++) {
                    //vm.coversequence[layersindex].push(coversequencetpl);
                    if(vm.hasShadow)vm.hires_covershadow[layersindex].push(shadow)
                    if(vm.hasShadow)vm.hires_covershadow[layersindex].blendMode = PIXI.BLEND_MODES.NORMAL
                }
                vm.hires_cover_object[layersindex] = vm.cover_object[layersindex]
                vm.hires_mask_object[layersindex] = vm.mask_object[layersindex]
            }


            for (index = 0; index < vm.scenestore.s_frames; index++) {
                for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {


                    //vm.hiResTextureMockup[layersindex][index] = new PIXI.Texture.fromImage(`${vm.scenestore.s_uri}/${vm.scenestore.s_layers[layersindex].l_id}/devices/${vm.current_device.i_img_title}/Device.png`);
                    vm.hiResTextureMockup[layersindex][index] = new PIXI.Texture.fromImage(`${vm.userExportSize[0]}/${vm.userExportSize[1]}/${vm.current_device[layersindex].i_img_uri}`);
                    if (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft !== false) {
                        let obj_origin = [
                            vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.x) / vm.hires_reduceratioX, (vm.scenestore.s_layers[layersindex].l_data[index].i_upperleft.y) / vm.hires_reduceratioY),
                            vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.x ) / vm.hires_reduceratioX, (vm.scenestore.s_layers[layersindex].l_data[index].i_upperright.y ) / vm.hires_reduceratioY),
                            vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.x ) / vm.hires_reduceratioX, (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerright.y ) / vm.hires_reduceratioY),
                            vm.setPoint((vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.x ) / vm.hires_reduceratioX, (vm.scenestore.s_layers[layersindex].l_data[index].i_lowerleft.y ) / vm.hires_reduceratioY),
                        ];
                        vm.hires_quad[layersindex].push(obj_origin.map(function(s) {
                            return s.position
                        }));
                    } else {
                        vm.hires_quad[layersindex].push([vm.setPoint(0, 0), vm.setPoint(1, 0), vm.setPoint(1, 1), vm.setPoint(0, 1)].map(function(s) {
                            return s.position
                        }));
                    }
                }
            }


            for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                // Loading sequences
                vm.hires_mockup_object[layersindex] = new PIXI.extras.AnimatedSprite(vm.hiResTextureMockup[layersindex]);
                vm.hires_mockup_object[layersindex]._texture.baseTexture.width = vm.userExportSize[0]
                vm.hires_mockup_object[layersindex]._texture.baseTexture.height = vm.userExportSize[1]
                console.log(vm.hires_mockup_object[layersindex])


                vm.hires_mockup_object_blink_screen_layers[layersindex] = new PIXI.extras.AnimatedSprite(vm.hiResTextureMockup[layersindex]);
                vm.hires_mockup_object_blink_screen_layers[layersindex]._texture.baseTexture.width = vm.userExportSize[0]
                vm.hires_mockup_object_blink_screen_layers[layersindex]._texture.baseTexture.height = vm.userExportSize[1]
                vm.hires_mockup_object_blink_screen_layers[layersindex].blendMode = PIXI.BLEND_MODES.SCREEN

                vm.hires_mockup_object_blink[layersindex] = new PIXI.extras.AnimatedSprite(vm.hiResTextureMockup[layersindex]);
                vm.hires_mockup_object_blink[layersindex]._texture.baseTexture.width = vm.userExportSize[0]
                vm.hires_mockup_object_blink[layersindex]._texture.baseTexture.height = vm.userExportSize[1]

                if(vm.hasShadow){
                    vm.hires_shadow_object[layersindex] = vm.hires_covershadow[layersindex][0]
                    vm.hires_shadow_object[layersindex]._texture.baseTexture.width = vm.userExportSize[0]*2
                    vm.hires_shadow_object[layersindex]._texture.baseTexture.height = vm.userExportSize[1]*2
                }

            }



        },

        // Основной метод, отвечающий за рендер одного кадра (механизм сборки повторяет базовый из файло pixi.core.js но для одного кадра)
         compositeStaticLayer() {

            // Для сборки используется доп рендер subrenderer_client отличный от основного
            var subrenderer_client = new PIXI.Application({
                width: vm.userExportSize[0],
                height: vm.userExportSize[1],
                transparent: true,
                resolution: 2,
                antialias: true,
                powerPreference: "high-performance"
            });
            //document.getElementById('techzone').appendChild(subrenderer_client.view);
             subrenderer_client.renderer.width = vm.userExportSize[0]
             subrenderer_client.renderer.height = vm.userExportSize[1]


            var loader = new PIXI.loaders.Loader();

             for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
                 loader.add(`${vm.userExportSize[0]}/${vm.userExportSize[1]}/${vm.current_device[layersindex].i_img_uri}`);
                 if(vm.hasShadow) loader.add(`${vm.scenestore.s_uri}${vm.scenestore.s_layers[layersindex].l_id}/Shadow/${vm.userExportSize[0]}/${vm.userExportSize[1]}/Shadow.png`);
             }

            loader.onProgress.add((x) => {
                vm.hiResPreloadPercentImg = x.progress
            });

            loader.load( async function(loader, resources) {

                console.log(vm.backgroundcolor)

                var scene_background = new PIXI.Graphics()
                var background_gradient = new PIXI.Sprite();
                scene_background.lineStyle(0, 0x000000, 0);
                scene_background.beginFill((0xFFFFFF), 1);
                scene_background.drawRect(0, 0, vm.userExportSize[0], vm.userExportSize[1]);
                scene_background.endFill();
                scene_background.tint = vm.rgb2hex([vm.backgroundcolor.rgba.r, vm.backgroundcolor.rgba.g, vm.backgroundcolor.rgba.b]);
                scene_background.alpha = vm.backgroundcolor.rgba.a;

                if (vm.colorsstack.length) {
                    var canvas = document.getElementById('subrender1');
                    canvas.width = vm.userExportSize[0]
                    canvas.height = vm.userExportSize[1]
                    var context = canvas.getContext('2d');
                    context.rect(0, 0, canvas.width, canvas.height);
                    var grd

                    if(vm.gradienttypevalue == 'linear')
                        grd = context.createLinearGradient(vm.x1, vm.y1, vm.userExportSize[0], vm.userExportSize[1] );
                    if(vm.gradienttypevalue == 'radial')
                        grd = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);

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
                subrenderer_client.stage.addChild(background_gradient);

                for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {

                    var texture_cover_distort = new PIXI.projection.Sprite2d(vm.hires_cover_object[layersindex].texture);
                    var texture_cover_distort_mask = new PIXI.projection.Sprite2d(vm.hires_mask_object[layersindex].texture);
                    var renderTextureCover = PIXI.RenderTexture.create(vm.userExportSize[0], vm.userExportSize[1]);
                    var renderTextureMask = PIXI.RenderTexture.create(vm.userExportSize[0], vm.userExportSize[1]);
                    texture_cover_distort.proj.mapSprite(texture_cover_distort, vm.hires_quad[layersindex][0]);
                    texture_cover_distort_mask.proj.mapSprite(texture_cover_distort_mask, vm.hires_quad[layersindex][0]);
                     subrenderer_client.renderer.render(texture_cover_distort, renderTextureCover);
                     subrenderer_client.renderer.render(texture_cover_distort_mask, renderTextureMask);

                    var mockup_layer = new PIXI.Sprite(vm.hires_mockup_object[layersindex].texture);
                    console.log(mockup_layer)
                    var blink_layer = new PIXI.Sprite(vm.hires_mockup_object_blink[layersindex].texture);
                    var cover_layer = new PIXI.Sprite(renderTextureCover);
                    var mask_layer = new PIXI.Sprite(renderTextureMask)
                    blink_layer.blendMode = vm.blend_mode;

                    var cover_container = vm.hires_distort_layers[layersindex]
                    cover_container.addChild(cover_layer);
                    cover_container.addChild(mask_layer);
                    cover_container.mask = mask_layer;

                    if(vm.activeWhiteClayDevice[layersindex]) {
                        blink_layer.blendMode = PIXI.BLEND_MODES.MULTIPLY
                        cover_container.addChild(blink_layer);
                        //cover_container.addChild(vm.hires_mockup_object_blink_screen_layers[layersindex]);
                    }else {
                        blink_layer.blendMode = vm.blend_mode
                        cover_container.addChild(blink_layer);
                    }


                    cover_container.filters = [new PIXI.filters.AdjustmentFilter({
                        gamma: vm.devicesFilters[layersindex].effectgamma+1 ,
                        contrast:  vm.devicesFilters[layersindex].effectcontrast+1,
                        saturation:  vm.devicesFilters[layersindex].effectsaturation+1,
                        brightness:  vm.devicesFilters[layersindex].effectbrightness+1,
                    })];

                    mockup_layer.filters = [new PIXI.filters.AdjustmentFilter({
                        gamma: vm.devicesFilters[layersindex].effectgamma+1 ,
                        contrast:  vm.devicesFilters[layersindex].effectcontrast+1,
                        saturation:  vm.devicesFilters[layersindex].effectsaturation+1,
                        brightness:  vm.devicesFilters[layersindex].effectbrightness+1,
                    })];


                    if(vm.activeChangeableDevice[layersindex]) {
                        mockup_layer.tint = vm.changeableDeviceColor[layersindex]
                        vm.hires_mockup_object_blink[layersindex].tint = 16777215
                    }else {
                        mockup_layer.tint = 16777215
                        vm.hires_mockup_object_blink[layersindex].tint = 16777215
                    }


                    if(vm.hasShadow)vm.hires_shadow_object[layersindex].blendMode = vm.shadow_blend_mode


                    if(vm.hasShadow) subrenderer_client.stage.addChild(vm.hires_shadow_object[layersindex]);

                    subrenderer_client.stage.addChild(mockup_layer);
                    subrenderer_client.stage.addChild(cover_container);
                }

                var renderTexture = PIXI.RenderTexture.create(vm.userExportSize[0], vm.userExportSize[1]);

                subrenderer_client.stage.filters = [new PIXI.filters.AdjustmentFilter({
                    gamma: vm.effectgamma+1 ,
                    contrast:  vm.effectcontrast+1,
                    saturation:  vm.effectsaturation+1,
                    brightness:  vm.effectbrightness+1,
                })]

                /*subrenderer_client.stage._texture.baseTexture.width = vm.userExportSize[0]*2
                subrenderer_client.stage._texture.baseTexture.height = vm.userExportSize[1]*2*/
                console.log(subrenderer_client)
                subrenderer_client.stage.cacheAsBitmap = true
                console.log(renderTexture)
                //subrenderer_client.stage.scale.set(0.5)
                PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
                subrenderer_client.stage.filters = [new PIXI.filters.FXAAFilter()]
                subrenderer_client.renderer.render(subrenderer_client.stage, renderTexture);
                /*renderTexture.cacheAsBitmap = true
                renderTexture.scale.set(0.5);*/

                /*renderTexture.width = vm.userExportSize[0]*2
                renderTexture.height = vm.userExportSize[1]*2
                renderTexture.cacheAsBitmap = true
                renderTexture.scale.set(0.5);*/

                subrenderer_client.renderer.extract.canvas(renderTexture).toBlob(function(b) {
                    console.log(b)
                    subrenderer_client.destroy(true)
                    var a = document.createElement('a');
                    document.body.append(a);
                    a.download = vm.scenestore.s_name + `.${vm.exportFormatType}`;
                    a.href = URL.createObjectURL(b);
                    a.click();
                    a.remove();
                    vm.waitRenderReady = false;
                    vm.renderwebalpha = false;
                    vm.hiResPreloadPercentImg = 0;
                }, `image/${vm.exportFormatType}`);

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
