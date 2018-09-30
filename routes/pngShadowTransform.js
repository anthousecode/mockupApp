const config = require("../config");
const express = require('express');
const router = express.Router();
const path = require('path');
var fs = require("fs");
var im = require('imagemagick');
// Ловим роут GET\POST к конкретному изображению с указнанием разрешения
router.all('/:sceneid/:scenelayer/Shadow/:width/:height/:picture', function (req, res, next) {
    var sceneid = req.params.sceneid;
    var scenelayer = req.params.scenelayer;
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

    var pathtoorig = `${config.path}${sceneid}/${scenelayer}/Shadow/${filename}`;
    console.log(pathtoorig)

    if (fs.existsSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/${filename}`)) {
        var stdout = fs.readFileSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/${filename}`, 'binary')
        res.contentType('image/png');
        res.end(stdout, 'binary');
    } else {
        // Ресайзим изображение
        im.resize({
                srcPath: pathtoorig,
                width: width,
                height: height,
                format: 'png',
            },
            function (err, stdout, stderr) {
                if (err) throw err;
                if (!fs.existsSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}`))
                    fs.mkdirSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}`); // Создаем папку если нет
                if (!fs.existsSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/${filename}`)) fs.writeFileSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/${filename}`, stdout, 'binary'); // Кешируем изображение в нужном рахрешении если его нет
                res.contentType('image/png');
                res.end(stdout, 'binary');
            })
    }

})
module.exports = router;
