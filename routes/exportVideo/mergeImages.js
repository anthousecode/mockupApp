const mergeImages = require('merge-images')
const fs = require("fs")

function mergeImage(...imagesArr) {
    var resultImage
    mergeImages(imagesArr)
        .then(b64 =>
            resultImage = b64
        );
    return resultImage
}

module.exports = mergeImage


