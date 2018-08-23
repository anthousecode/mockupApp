const makeStringForMerge = (pathToScene, sequencesArr, frame, width, heigth, filters, ...other) => {

    let pathString = []

    let path = pathToScene


    other.forEach(e => pathString.push(e))

    for(let i = 0; i < sequencesArr.length; i++) {

        pathString.push(`${path}/${i+1}/device/${width}/${frame}.png`)
        if (sequencesArr[i] !== ``) pathString.push(sequencesArr[i])

    }

    return pathString

}

module.exports = makeStringForMerge

/*
const PIXI = require('pixi-shim')
const decodeBase64Image = require('./decodeBase64Image')
const filters = require('pixi-filters')

const makeStringForMerge = (pathToScene, sequencesArr, frame, width, heigth, filter, ...other) => {

    let pathString = []

    let path = pathToScene

    var loader = new PIXI.loaders.Loader();


    var subrenderer_client = new PIXI.Application({
        width: width,
        height: heigth,
        transparent: true,
        resolution: 1,
        antialias: true,
        powerPreference: "high-performance"
    });

    subrenderer_client.renderer.width = width;
    subrenderer_client.renderer.height = heigth;

    other.forEach(e => pathString.push(e))

    for(let i = 0; i < sequencesArr.length; i++) {

        //var mockupImg = new PIXI.Texture.fromImage(`${path}/${i+1}/device/${width}/${frame}.png`)

        let sprite = new PIXI.Sprite.fromImage(`${path}/${i+1}/device/${width}/${frame}.png`);


        /!*var img = new Image();
        img.src = `${path}/${i+1}/device/${width}/${frame}.png`;
        var base = new PIXI.BaseTexture(img)
        var texture = new PIXI.Texture(base);
*!/




        /!*let texture = PIXI.Texture.fromImage(`${path}/${i+1}/device/${width}/${frame}.png`);
        let sprite1 = new PIXI.Sprite(texture);
*!/

        var ff = new filters.AdjustmentFilter({
            gamma: filter.gamma,
            contrast: filter.contrast,
            saturation: filter.saturation,
            brightness: filter.brightness,
        })
        sprite.filters = [ff];

        /!* var baseTexture = new PIXI.BaseTexture.fromImage(`${path}/${i+1}/device/${width}/${frame}.png`);
         var playerTexture = new PIXI.Texture(baseTexture);

         var player = new PIXI.Sprite.from(playerTexture);*!/


        var mockupBase64 = subrenderer_client.renderer.extract.base64(sprite)

        console.log(sprite)

        pathString.push(mockupBase64)
        pathString.push(sequencesArr[i])

    }

    return pathString

}

module.exports = makeStringForMerge*/
