const express = require('express');
const Account = require('../models/account');
const router = express.Router();

router.get('/', function(req, res, next) {
    Account.find(function(err, account) {
      res.render('admin', {user: req.user,
                           accounts : account });
    });
});

module.exports = router;
