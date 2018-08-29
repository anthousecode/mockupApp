const config = require("../../config")
const express = require('express')
const router = express.Router()
const fs = require("fs")
const mergeImages = require('merge-images')
const crypto = require('crypto');
var img_converted;

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

router.all('/:id', function(req, res){
    console.log(req.params)
    const { size, layers } = req.params

    const path = config.back_export // /routes/mergeImages/session/

    //создание папки сессии
    const seed = crypto.randomBytes(20)
    const uniqueSHA1String = crypto.createHash('sha1').update(seed).digest('hex')

    const sessionFolder = path + uniqueSHA1String
    fs.mkdirSync(sessionFolder)

    //создание папки для мокапов, масок, и бликов в сессии
    fs.mkdirSync(`${sessionFolder}/mockups`)
    fs.mkdirSync(`${sessionFolder}/blink`)
    fs.mkdirSync(`${sessionFolder}/masks`)

    var frame = 0
    //сохраняем мокапы, блики и маски по папкам
    for (const key in layers) {

        layers[key].forEach(e => {
            img_converted = decodeBase64Image(e)
            fs.writeFile(path + key + '/' + frame + '.png', img_converted.data)
            frame++
        })
        frame = 0
    }



    let pathi = `${config.back_scenes }/0TestMockup/1/device/800`

    fs.readdir(pathi, function(err, items) {
        console.log(items)
    });




})

module.exports = router;
