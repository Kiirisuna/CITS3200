const express = require('express');
const Form7 = require('../models/form7');
const router = express.Router();
const Account = require('../models/account');

router.get('/', function(req, res, next) {
    Form7.findOne({owner: req.user.username}, function(err, doc){
        res.render('form7StudentReview', { user : req.user,
                                           form7: doc
                                         });
    });
});

router.get('/:id', function(req, res, next) {
	Account.find({admin : true}, function(err, account) {
		Form7.findOne({ _id : req.params.id }, function(err, doc) {
			res.render('form7StudentReview', { user: req.user,
											   form7 : doc,
											   admins: account
											 });
		});
	});
});

module.exports = router;
