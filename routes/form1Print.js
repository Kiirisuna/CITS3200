const express = require('express');
const Form1 = require('../models/form1');
const router = express.Router();
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var url = require('url');
var fs = require('fs');

router.get('/', function(req, res, next) {
    Form1.findOne({ owner : req.user.username }, function(err, doc) {
        res.render('form1Print', { user: req.user,
                                    form1 : doc
                                  });
    });
});

router.post('/printForm1', function(req, res) {
	console.log("printing form 1");
	var filename = req.body.fid + "form1.pdf";
	 var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + req.body.fid;
	 fullUrl = fullUrl.replace('/printForm1', '');

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
    Form1.findOne({ _id : req.params.id }, function(err, doc) {
        res.render('form1Print', { user: req.user,
                                    form1 : doc
                                  });
    });
});

module.exports = router;
