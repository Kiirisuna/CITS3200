const express = require('express');
const RiskAssForm = require('../models/riskAssForm');
const router = express.Router();
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var url = require('url');
var fs = require('fs');

router.get('/', function(req, res, next) {
    RiskAssForm.findOne({owner: req.user.username}, function(err, doc){
        res.render('riskAssFormPrint', { user : req.user,
                                         riskform : doc
                                       });
    });
});

router.post('/printRisk', function(req, res) {
	console.log("printing risk"); 
	var filename = req.body.fid + "printRisk.pdf";
	 var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + req.body.fid;
	 fullUrl = fullUrl.replace('/printRisk', '');
	 
	console.log(fullUrl);
	var childArgs = [
	  path.join(__dirname, '../HTMLtoPDF_ver2.js'),
	  fullUrl, filename, '842px*595px'
	];//change the fixed URL to window.location.href,
	   
	childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
	  // handle results 
	  if(err) {
		console.log(err);
	 }
	 console.log(path.join(__dirname, ('../' + filename)));
	 res.sendFile(path.join(__dirname, ('../' + filename)));
	  //opn (path.join(__dirname, ('../' + filename)));  //{app: 'chrome'}, currently opens it in default browser
	  /*fs.unlink(filename,function(err){
			if(err) return console.log(err);
			console.log('file deleted successfully');
			});*/
	  fs.stat(filename, function (err, stats) {
	   console.log(stats);//here we got all information of file in stats variable

	   if (err) {
		   return console.error(err);
	   }
	   
	   fs.unlink(filename,function(err){
			if(err) return console.log(err);
			console.log('file deleted successfully');
	   });

	     
	});
	});
	
});

router.get('/:id', function(req, res, next) {
    RiskAssForm.findOne({ _id : req.params.id }, function(err, doc) {
        res.render('riskAssFormPrint', { user: req.user,
                                         riskform : doc
                                       });
    });
});


module.exports = router;
