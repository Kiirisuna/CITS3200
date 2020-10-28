const express = require('express');
const Account = require('../models/account');
const router = express.Router();

router.get('/:token', function(req, res) {
  Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      res.redirect('/');
    }
    res.render('reset', {
      user: user
    });
  });
});

module.exports = router;
