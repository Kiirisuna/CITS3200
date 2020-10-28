const express = require('express');
const Form1 = require('../models/form1');
const Form7 = require('../models/form7');
const RiskAssForm = require('../models/riskAssForm');
const router = express.Router();

router.get('/', function(req, res, next) {
    Form1.find({owner: req.user.username}, function(err, f1) {
        Form7.find({owner : req.user.username}, function(err, f7) {
            RiskAssForm.find({owner : req.user.username}, function(err, risk) {
                Form1.find({admin : req.user.username}, function(err, f1admin) {
                    Form7.find({admin : req.user.username}, function(err, f7admin) {
                        RiskAssForm.find({admin : req.user.username}, function(err, riskadmin) {
		                         res.render('dashboard', { user : req.user,
                                                       form1: f1,
                                                       form7: f7,
                                                       riskform: risk,
                                                       form1admin: f1admin,
                                                       form7admin: f7admin,
                                                       riskformadmin: riskadmin
                                                     });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
