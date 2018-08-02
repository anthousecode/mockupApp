const config = require("../../config")
const express = require('express')
const router = express.Router()
const fs = require("fs")
const crypto = require('crypto')
const mergeImages = require('merge-images')
const Canvas = require('canvas');

const decodeBase64Image = require('./decodeBase64Image')
//const mergeImages = require('./mergeImages')

var sequencesArr = []


router.all('/:id', function(req, res){

/*    var res = `${config.back_scenes}/0TestMockup/mockups`

    const mc1 = fs.readdir(`${config.back_scenes}/0TestMockup/1/device`)
    const mc2 = fs.readdir(`${config.back_scenes}/0TestMockup/2/device`)
    const mc3 = fs.readdir(`${config.back_scenes}/0TestMockup/3/device`)
    const mc4 = fs.readdir(`${config.back_scenes}/0TestMockup/4/device`)

    var path = `./ads/scenes/0TestMockup`

    for(let i = 0; i < mc1.length; i++) {
        mergeImages([
            `${path}/1/device/${mc1[i]}`,
            `${path}/2/device/${mc2[i]}`,
            `${path}/3/device/${mc3[i]}`,
            `${path}/4/device/${mc4[i]}`
        ], {
            Canvas: Canvas
        })
            .then(b64 => {
                var img = decodeBase64Image(b64)
                fs.writeFileSync(`${res}/${i}.png`, img.data)
            })
    }*/

    const { size, sequence, email } = req.params

    const framesCount = sequence.count
    const sceneId = sequence.scene_id


    if (sequencesArr.length !== framesCount) {
        sequencesArr.push(sequence)
    } else {
        const path = config.back_export // /routes/exportVideo/session/

        //создание папки сессии
        const seed = crypto.randomBytes(20)
        const uniqueSHA1String = crypto.createHash('sha1').update(seed).digest('hex')

        const sessionFolder = path + uniqueSHA1String
        fs.mkdirSync(sessionFolder)

        //создание папки для сиквенсов
        const sequencesFolder = `${sessionFolder}/sequences`
        fs.mkdirSync(sequencesFolder)

        //сохраняем сиквенсы в папку
        for (let i = 0; i < sequences.length; i++) {
            let dataImgBase64 = sequences[i]

            img_converted = decodeBase64Image(dataImgBase64.chunk)
            fs.writeFile(`${sequencesFolder}/${dataImgBase64.frame}.png`, img_converted.data)
        }

        //считывание всех файлов в папках сиквенсов и мокапов и помещение их в массив

        //создание папки result, и помещение туда склеянных картинок из сиквенсов и мокапов
        const mockupsFolder = `${config.back_scenes}/${sceneId}`
        const mockupsArr = fs.readdir(`${mockupsFolder}/mockups`)
        const sequencesArr = fs.readdir(sequencesFolder)

        fs.mkdirSync(`${sessionFolder}/result`)
        let image_convert

        for(let i = 0; i < framesCount; i++) {

            let dataImgString = mergeImages(`../ads/scenes/${sceneId}/mockups/${mockupsArr[i]}`,`../session/${uniqueSHA1String}/sequences/${sequencesArr[i]}`)
            image_convert = decodeBase64Image(dataImgString)

            fs.writeFileSync(`${sessionFolder}/result/${i}.png`, image_convert.data)
        }

    }
})

module.exports = router;