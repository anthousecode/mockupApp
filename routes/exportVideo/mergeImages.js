const mergeImages = require('merge-images');
const fs = require("fs");
const Canvas = require('canvas');

const mergeImage = (...imgArr) => {
    //console.log(imgArr)

    var result = mergeImages(imgArr, {
        Canvas: Canvas
    })

    return result
}


module.exports = mergeImage;


