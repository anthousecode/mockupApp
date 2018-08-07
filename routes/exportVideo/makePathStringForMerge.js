const makeStringForMerge = (pathToScene, sequencesArr, frame, width, ...other) => {

    let pathString = []

    let path = pathToScene

    other.forEach(e => pathString.push(e))

    for(let i = 0; i < sequencesArr.length; i++) {

        pathString.push(`${path}/${i+1}/device/${width}/${frame}.png`)
        pathString.push(sequencesArr[i])

    }

    return pathString

}

module.exports = makeStringForMerge