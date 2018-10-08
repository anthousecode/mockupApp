const config = require("../config");
const express = require('express');
const router = express.Router();
const path = require('path');
var fs = require("fs");
var im = require('imagemagick');
var rmdir = require('rimraf');
// Ловим роут GET\POST к конкретному изображению с указнанием разрешения
router.all('/:sceneid/:scenelayer/Shadow/:width/:height/:picture', function (req, res, next) {
    var sceneid = req.params.sceneid;
    var scenelayer = req.params.scenelayer;
    var filename = req.params.picture;
    var width = req.params.width
    var height = req.params.height

    console.log(width, height)

    var pathtoorig = `${config.path}${sceneid}/${scenelayer}/Shadow/${filename}`;
    console.log(pathtoorig)

    if (fs.existsSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/${filename}`)) {
        console.log(`exists!`)
        var stdout = fs.readFileSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/${filename}`, 'binary')
        res.contentType('image/png');
        res.end(stdout, 'binary');
    } else {
        // Ресайзим изображение
        im.resize({
                srcPath: pathtoorig,
                width: parseInt(width),
                height: parseInt(height),
                format: 'png',
            },
            function (err, stdout, stderr) {
                if (err) throw err;
                if (!fs.existsSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}`))
                    fs.mkdirSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}`); // Создаем папку если нет
                if (!fs.existsSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/${filename}`)) fs.writeFileSync(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/${filename}`, stdout, 'binary'); // Кешируем изображение в нужном рахрешении если его нет
                res.contentType('image/png');
                res.end(stdout, 'binary');
                rmdir(`${config.path}${sceneid}/${scenelayer}/Shadow/${width}/`, function(error){console.log(error)});
            })
    }

})
module.exports = router;
