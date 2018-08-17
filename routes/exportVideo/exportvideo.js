var config = require('../../config');
var LZString = require('lz-string');
var exec = require('executive');
var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var Caman = require('caman').Caman;
var LZUTF8 = require('lzutf8');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var PIXI = require('pixi-shim')
var pix = PIXI
var filters = require('pixi-filters')
const {AdjustmentFilter} = require('@pixi/filter-adjustment');

var { PIXI } = require('node-pixi')

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
var indexId = 0

var stringPathToMockups = []


var subrenderer_client


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
        if (req.body.unique_id && req.body.scene_store) {
            let sequences = req.body.chunk
            let frame = req.body.frame
            let width = req.body.width
            let height = req.body.height
            let scenestore = req.body.scene_store
            let exportratio = req.body.exportratio

            // for(let i = 0; i < req.body.chunk.length; i++){
            //   let	outputArr = Object.values(sequences[i]);
            //   let uint8 = new Uint8Array(outputArr);
            //   let output = LZUTF8.decompress(uint8);
            //   sequences.push(output);
            // }
            //console.log(sequences);

            var porthiRes = []

            var cover_object = []
            var coversequence = []

            var setPoint = (x, y) => {
                var square = new PIXI.Sprite(PIXI.Texture.WHITE);
                //square.tint = 0xff0000;
                square.factor = 1;
                //square.anchor.set(0.5);
                square.position.set(x, y);
                return square;
            }

            console.log(scenestore)



            // Основной метод, отвечающий за рендер одного кадра (механизм сборки повторяет базовый из файло pixi.core.js но для одного кадра)
            const compositeLayer =(index) => {
                var subrenderer_client = new PIXI.Application({
                    forceCanvas: true,
                    width: width,
                    height: height,
                    transparent: true,
                    resolution: 1,
                    antialias: true,
                    powerPreference: "high-performance"
                });

                subrenderer_client.renderer.width = width;
                subrenderer_client.renderer.height = height;

                var loader = new PIXI.loaders.Loader();

                for (layersindex = 0; layersindex < scenestore.s_mcount; layersindex++) {
                    coversequence[layersindex] = []
                    cover_object[layersindex] = coversequence[layersindex][0]
                    loader.add(scenestore.s_uri + scenestore.s_layers[layersindex].l_id + '/device/' + width + '/' + width + '/' + scenestore.s_layers[layersindex].l_data[index].i_img_uri);
                }


                loader.load(() => {
                    for (layersindex = 0; layersindex < scenestore.s_mcount; layersindex++) {

                        let coversequencetpl = new PIXI.projection.Sprite2d(new PIXI.Texture.fromImage(scenestore.s_uri + scenestore.s_layers[layersindex].l_id + '/' + 'screen.jpg', true, PIXI.SCALE_MODES.LINEAR));
                        for (index = 0; index < scenestore.s_frames; index++) {
                            coversequence[layersindex].push(coversequencetpl);
                        }``

                        let hires = new PIXI.Texture.fromImage(scenestore.s_uri + scenestore.s_layers[layersindex].l_id + '/device/' + portWidth + '/' + portHeight + '/' + scenestore.s_layers[layersindex].l_data[index].i_img_uri);
                        porthiRes[layersindex] = hires;
                    }

                    for (layersindex = 0; layersindex < scenestore.s_mcount; layersindex++) {
                        //нужно сгенерить quad_origin!
                        //var deform = quad_origin[layersindex][index]
                        var deform

                        if (scenestore.s_layers[layersindex].l_data[index].i_upperleft !== false) {
                            let offsetx = 0 - scenestore.s_layers[layersindex].l_data[index].i_offset.x;
                            let offsety = 0 - scenestore.s_layers[layersindex].l_data[index].i_offset.y;
                            let obj_origin = [
                                setPoint((scenestore.s_layers[layersindex].l_data[index].i_upperleft.x - offsetx) / exportratio, (scenestore.s_layers[layersindex].l_data[index].i_upperleft.y - offsety) / exportratio),
                                setPoint((scenestore.s_layers[layersindex].l_data[index].i_upperright.x - offsetx) / exportratio, (scenestore.s_layers[layersindex].l_data[index].i_upperright.y - offsety) / exportratio),
                                setPoint((scenestore.s_layers[layersindex].l_data[index].i_lowerright.x - offsetx) / exportratio, (scenestore.s_layers[layersindex].l_data[index].i_lowerright.y - offsety) / exportratio),
                                setPoint((scenestore.s_layers[layersindex].l_data[index].i_lowerleft.x - offsetx) / exportratio, (scenestore.s_layers[layersindex].l_data[index].i_lowerleft.y - offsety) / exportratio),
                            ];
                            deform = obj_origin.map(function(s) {
                                return s.position
                            });
                        } else {
                            deform = [setPoint(0, 0), setPoint(1, 0), setPoint(1, 1), setPoint(0, 1)].map(function(s) {
                                return s.position
                            });
                        }

                        //сгенерить cover_object
                        var texture_cover_distort = new PIXI.projection.Sprite2d(cover_object[layersindex].texture);

                        var texture_cover_distort_mask = new PIXI.projection.Sprite2d(mask_object[layersindex].texture);
                        var renderTextureCover = PIXI.RenderTexture.create(width, height);
                        var renderTextureMask = PIXI.RenderTexture.create(width, height);
                        texture_cover_distort.proj.mapSprite(texture_cover_distort, deform);
                        texture_cover_distort_mask.proj.mapSprite(texture_cover_distort_mask, deform);
                        subrenderer_client.renderer.render(texture_cover_distort, renderTextureCover);
                        subrenderer_client.renderer.render(texture_cover_distort_mask, renderTextureMask);
                        var mockup_layer = new PIXI.Sprite(porthiRes[layersindex]);
                        var blink_layer = new PIXI.Sprite(porthiRes[layersindex]);
                        var cover_layer = new PIXI.Sprite(renderTextureCover);
                        var mask_layer = new PIXI.Sprite(renderTextureMask)

                        blink_layer.blendMode = PIXI.BLEND_MODES.SCREEN;
                        var cover_container = new PIXI.Container()
                        cover_container.addChild(cover_layer);
                        cover_container.addChild(blink_layer);
                        cover_container.addChild(mask_layer);
                        cover_container.mask = mask_layer;

                        subrenderer_client.stage.addChild(mockup_layer);
                        subrenderer_client.stage.addChild(cover_container);
                    } //конец цикла

                    subrenderer_client.renderer.render(subrenderer_client.stage)

                    subrenderer_client.view.toBuffer('png').then(buffer => {
                        fs.writeFileSync(`${result_path}/${index}.png`, buffer);
                    }).catch(err => {
                        console.error(err);
                    });

                })
            }

            for(let i =0; i< scenestore.s_frames; i++) compositeLayer(i)


            /*loader.load(() => {

                            for(let i = 0; i < sequences.length; i++) {

                                var phoneContainer = new PIXI.Container()

                                var a = fs.readFileSync(`${config.back_scenes}${sceneId}/${i+1}/device/${width}/${frame}.png`, 'base64')

                                let textureMockup = new PIXI.Texture.fromImage(`data:image/png;base64,${a}`)
                                var spriteMockup  = new PIXI.Sprite(textureMockup)

                                let textureSeq = new PIXI.Texture.fromImage(sequences[i])
                                var spriteSeq  = new PIXI.Sprite(textureSeq)

                                let bgTexture = new PIXI.Texture.fromImage(scene_backgroundBase64)
                                var bgSeq  = new PIXI.Sprite(bgTexture)

                                phoneContainer.addChild(bgSeq)
                                phoneContainer.addChild(spriteMockup)
                                phoneContainer.addChild(spriteSeq)

                                subrenderer_client.stage.addChild(phoneContainer);

                            }

                            index++

                            subrenderer_client.stage.filters = [new AdjustmentFilter({
                                gamma: filter.gamma,
                                contrast: filter.contrast,
                                saturation: filter.saturation,
                                brightness: filter.brightness,
                            })];

                            var renderTexture = PIXI.RenderTexture.create(width, height);
                            subrenderer_client.renderer.render(subrenderer_client.stage);

                            //subrenderer_client.render()


                            subrenderer_client.view.toBuffer('png').then(buffer => {
                                fs.writeFileSync(`${result_path}/${index}.png`, buffer);
                            }).catch(err => {
                                console.error(err);
                            });

                            res.send({
                                'status': 'file_created'
                            });
                            //let cover_base64 = subrenderer_client.renderer.extract.base64(sprite)

                            //console.log(cover_base64)

                        })*/
            //stringPathToMockups = makeStringForMerge(`${config.back_scenes}${sceneId}`, sequences, frame, width, height, scene_backgroundBase64, background_gradientBase64)

            //получаем из чанка формат base64 и склеиваем его со всем остальным
            console.log(frame)
            //img_converted = decodeBase64Image(req.body.chunk);

            //let base64String = mergeImages(stringPathToMockups)

            /*base64String
                .then(b64 => {

                   /!* subrenderer_client = new PIXI.Application();

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
                    sprite.filters = [ff];

                    var base64 = subrenderer_client.renderer.extract.base64(sprite)
                    console.log(base64)*!/

                        return decodeBase64Image(b64)
                    }
                )
                .then(b64String =>
                    fs.writeFile(`${result_path}/${frame}.png`, b64String.data, function(err) {
                        if (err) {
                            return console.log(err);
                        }

                       /!* Caman(b64String.data, function () {
                            //console.log(filters)
                            this.contrast(filters.contrast)
                            //this.exposure(filters.exposure)
                            this.saturation(filters.saturation)
                            this.brightness(filters.brightness);
                            this.render(function () {
                                this.save(`${output_path}/${frame}.png`);
                            });
                        })*!/

                        res.send({
                            'status': 'file_created'
                        });
                        // Если файл последний - запускаем конвертирование файла в видео
                        if ((req.body.count) == fs.readdirSync(path + req.body.unique_id + '/').length) {
                            /!*

                            Команды для типового экспорта без альфы
                            "ffmpeg -framerate 30 -i '"+path+req.body.unique_id+"/%d.png' -qmax 2 "+path+req.body.unique_id+"/out.mp4",
                            "mv "+path+req.body.unique_id+"/out.mp4 "+path+req.body.unique_id+"/"+req.body.filename+".mp4"

                            Команда на получение маски
                            ffmpeg -framerate 30 -i "%d.png" -qmax 2 -vf alphaextract out.mp4

                            Команда на склеивание двух видео вертикально
                            ffmpeg -framerate 30 -i "%d.png" -i out.mp4 -qmax 2 -filter_complex vstack stacked.mp4
                            *!/
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
                )*/

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
