const config = require("../config");
const express = require('express');
const router = express.Router();
const path = require('path');
var fs = require("fs");
var im = require('imagemagick');
var Jimp = require('jimp');
// Ловим роут GET\POST к конкретному изображению с указнанием разрешения
router.all('/:width/:height/scenes/:sceneid/:scenedir/devices/:device/:picture', function (req, res, next) {
    var sceneid = req.params.sceneid;
    var scenedir = req.params.scenedir;
    var filename = req.params.picture;
    var width = req.params.width
    var height = req.params.height
    var device = req.params.device

    console.log(width, height)

/*
    console.log(`${sceneid}/${scenedir}/devices/${device}/${filename}`)



    var stdout = fs.readFileSync(pathtoorig, 'binary');
    res.contentType('image/png');
    res.end(stdout, 'binary');*/



    var pathtoorig = `${config.path}${sceneid}/${scenedir}/devices/${device}/${filename}`;
    console.log(pathtoorig)

    if (fs.existsSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`)) {
        console.log(`exist!`)
        var stdout = fs.readFileSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`, 'binary')
        res.contentType('image/png');
        res.end(stdout, 'binary');
    } /*else if(!fs.existsSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`) && width > 2000) {
        console.log(`more than 2000!`)
        if (!fs.existsSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}`))
            fs.mkdirSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}`);
        Jimp.read(pathtoorig)
            .then(img => {
                return img
                    .resize(parseInt(width), parseInt(height)) // resize
                    .quality(100) // set JPEG quality
                    .write(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`); // save
            })
            .catch(err => {
                console.error(err);
            });
    } */else {
        // Ресайзим изображение

        im.resize({
                srcPath: pathtoorig,
                width: parseInt(width),
                height: parseInt(height),
                format: 'png',
            },
            function (err, stdout, stderr) {
                if (err) throw err;
                if (!fs.existsSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}`))
                    fs.mkdirSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}`); // Создаем папку если нет
                if (!fs.existsSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`)) fs.writeFileSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`, stdout, 'binary'); // Кешируем изображение в нужном рахрешении если его нет
                res.contentType('image/png');
                res.end(stdout, 'binary');
            })
    }
})
module.exports = router;
