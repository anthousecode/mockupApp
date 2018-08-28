var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/export', function(req, res, next) {
    res.setHeader('content-disposition: attachment; filename=file.mp4');
    res.setHeader('content-disposition: attachment; filename=file.mp4');
});

module.exports = router;
