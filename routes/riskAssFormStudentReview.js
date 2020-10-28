const express = require('express');
const RiskAssForm = require('../models/riskAssForm');
const router = express.Router();
const Account = require('../models/account');

router.get('/', function(req, res, next) {
    RiskAssForm.findOne({owner: req.user.username}, function(err, doc){
        res.render('riskAssFormStudentReview', { user : req.user,
                                          riskform : doc
                                        });
    });
});

router.get('/:id', function(req, res, next) {
	Account.find({admin : true}, function(err, account) {
		RiskAssForm.findOne({ _id : req.params.id }, function(err, doc) {
			res.render('riskAssFormStudentReview', { user: req.user,
													 riskform : doc,
													 admins: account
												   });
		});
	});
});


module.exports = router;
