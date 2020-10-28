const express = require('express');
const Form1 = require('../models/form1');
const router = express.Router();
const Account = require('../models/account');

router.get('/', function(req, res, next) {
	Account.find({admin : true}, function(err, account) {
		Form1.find({owner: req.user.username}, function(err, f1) {
			res.render('riskAssForm', { user : req.user,
								form1: f1,
								admins: account});
		});
	});
});

module.exports = router;
