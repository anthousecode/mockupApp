// Подключаем модули
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var engines = require('consolidate');
var config  = require("./config");
var history = require('connect-history-api-fallback');
var bodyParser = require('body-parser');

// Определяем положение скриптов-роутов
var indexRouter		   = require('./routes/index');
var apiScenesListRouter	   = require('./routes/sceneslist');
var apiScenesIdRouter 	   = require('./routes/scenesid');
var apiExportVideoRouter   = require('./routes/exportvideo');
var apiScenesPngTransform  = require('./routes/pngtransform');
var apiDownloadExportVideo = require('./routes/downloader');
var apiGetGradientsList    = require('./routes/getgradientlist');
var mergeImages = require('./routes/mergeImages/mergeImages')


var app = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', engines.mustache);
app.set('view engine', 'html');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Основная логика аля mod-rewrite
app.use(history({
 index: '/',
 rewrites: [
    {from: /\/api\/sceneslist/,  to: '/api/sceneslist/'},
    {from: /\/api\/gradientlist/,  to: '/api/gradientlist/'},
    {from: /\/api\/exportvideo/, to: '/api/exportvideo/'},
    {from: /\/api\/scenes\/[A-Za-z\-\_0-9]+/, to:  function(context) {
        return  context.parsedUrl.pathname;
    }},
    {from: /\/export\/.+/, to:  function(context) {
        return  context.parsedUrl.pathname;
    }},
    {from: /\/scenes\/[A-Za-z\-\_0-9]+\/[A-Za-z\-\_0-9]+\/device\/\d+\/\d+\/[A-Za-z\-\_0-9]\.png/, to:  function(context) {
        
    		console.log(context.parsedUrl)
        return  context.parsedUrl.pathname;
    }},
  ]
}));


// Вызов соотвествующих скриптов роутов
app.use('/', indexRouter);
app.use('/api/sceneslist', apiScenesListRouter);
app.use('/api/gradientlist', apiGetGradientsList);
app.use('/api/scenes', apiScenesIdRouter);
app.use('/api/exportvideo', apiExportVideoRouter);
app.use('/scenes', apiScenesPngTransform);
app.use('/export', apiDownloadExportVideo);
app.use('/api/mergeimages', mergeImages);



// 404 ошибка
app.use(function(req, res, next) {
  next(createError(404));
});


module.exports = app;

var port = (process.env.PORT || config.port);
app.set('port', port);
app.listen(port);

