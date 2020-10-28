const express = require('express');
const Account = require('../models/account');
const router = express.Router();
const Form1 = require('../models/form1');
const Form7 = require('../models/form7');
const RiskAssForm = require('../models/riskAssForm');

router.get('/:username', function(req, res, next) {
	Account.findOne({ username: req.params.username }, function(err, account) {
		Form1.find({ owner: req.params.username }, function(err, f1) {
			Form7.find({ owner: req.params.username }, function(err, f7) {
				RiskAssForm.find({ owner: req.params.username }, function(err, risk) {
						 res.render('viewForms', { user : req.user,
											   form1: f1,
											   form7: f7,
											   riskform: risk,
											   account: account
						});
					});
				});
			});
		});
});

module.exports = router;
