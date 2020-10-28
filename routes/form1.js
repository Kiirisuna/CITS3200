const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('form1', { user : req.user });
});

module.exports = router;
