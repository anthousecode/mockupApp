const config = require("../config");
const express = require('express');
const router = express.Router();
const path = require('path');
var fs = require("fs");
var im = require('imagemagick');
// Ловим роут GET\POST к конкретному изображению с указнанием разрешения
router.all('/:sceneid/:scenedir/devices/:device/:picture', function (req, res, next) {
    console.log(`sdgdzsfg`)
    var sceneid = req.params.sceneid;
    var scenedir = req.params.scenedir;
    var device = req.params.device
    var filename = req.params.picture;


    console.log(`${sceneid}/${scenedir}/devices/${device}/${filename}`)

    var pathtoorig = `${config.path}${sceneid}/${scenedir}/devices/${device}/${filename}`;

    var stdout = fs.readFileSync(pathtoorig, 'binary');
    res.contentType('image/png');
    res.end(stdout, 'binary');

    /*if (fs.existsSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`)) {
        var stdout = fs.readFileSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`, 'binary');
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
                if (!fs.existsSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}`))
                    fs.mkdirSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}`); // Создаем папку если нет
                if (!fs.existsSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`)) fs.writeFileSync(`${config.path}${sceneid}/${scenedir}/devices/${device}/${width}/${filename}`, stdout, 'binary'); // Кешируем изображение в нужном рахрешении если его нет
                res.contentType('image/png');
                res.end(stdout, 'binary');
            })
    }*/

})
module.exports = router;
