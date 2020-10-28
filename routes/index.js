const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Form1 = require('../models/form1');
const Form7 = require('../models/form7');
const RiskAssForm = require('../models/riskAssForm');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');
var Binary = require('mongodb').Binary;
var formidable = require('formidable');
var fs = require('fs');

// Get home page
router.get('/', function(req, res) {
    res.render('index');
});

//Gets the register page
router.get('/register', function(req, res) {
    res.render('register');
});

//Handle the form post for registering an account
router.post('/register', function(req, res) {
    Account.register(new Account({ username: req.body.username,
                                   firstName: req.body.firstName,
                                   lastName: req.body.lastName }), req.body.password, function(err, account) {
        if(err) {
            console.log(err);
            return res.redirect('/register');
        }

        passport.authenticate('local')(req, res, function() {
            res.redirect('/dashboard');
        });
    });
});

//Handle login
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/dashboard');
});

//Create a new form 1
router.post('/form1/:username', function(req, res) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd;
  }
  if(mm<10){
    mm='0'+mm;
  }
  var today = dd+'/'+mm+'/'+yyyy;
  Form1.count({owner : req.user.username}, function(err, c) {
    Form1.create(new Form1({ owner: req.user.username,
                             admin: '',
                             state: 'Complete',
                             formName: req.user.firstName + ' ' + req.user.lastName + ' - Form 1' + ' - ' + (c+1),
                             name: req.body.name,
                             idNumber: req.body.idnum,
                             emerName1: req.body.emername1,
                             emerName2: req.body.emername2,
                             emerRelation1: req.body.emerrelation1,
                             emerRelation2: req.body.emerrelation2,
                             emerPhone1: req.body.emerphone1,
                             emerPhone2: req.body.emerphone2,
                             participation: req.body.participation,
                             policy: req.body.policy,
                             report: req.body.report,
                             policies: req.body.policies,
                             drug: req.body.drug,
                             aware: req.body.aware,
                             training: req.body.training,
                             security: req.body.security,
                             vaccinations: req.body.vaccinations,
                             limitations: req.body.limitations,
                             fit: req.body.fit,
                             medicalAdvice: req.body.medicalAdvice,
                             complete: req.body.complete,
                             responsibility: req.body.responsibility,
                             supervisor: req.body.supervisor,
                             volunteer: req.body.volunteer,
                             completed: req.body.completed,

                             dateFilled: today }), function(err, form1) {

                             if(err) {
                                console.log(err);
                                return res.status(500).send('Database post error');
                             }

                             res.redirect('/dashboard');
                             });
                           });
});

//Create a new form7
router.post('/form7/:username', function(req, res) {
	var form = new formidable.IncomingForm();
	form.multiples = true;
	//console.log(form.bytesReceived);
	form.parse(req, function (err, fields, files) {
	//form.encoding = 'utf-8';
	//form.type = 'multipart';
	  var today = new Date();
	  var dd = today.getDate();
	  var mm = today.getMonth()+1; //January is 0!

	  var yyyy = today.getFullYear();
	  if(dd<10){
		dd='0'+dd;
	  }
	  if(mm<10){
		mm='0'+mm;
	  }
	  var today = dd+'/'+mm+'/'+yyyy;
	  console.log(files);
	  Form7.count({owner : req.user.username}, function(err, c) {
		Form7.create(new Form7({ owner: req.user.username,
								 admin: fields.fcemail,                //Goes to fieldwork coordinator
								 state: 'Pending',
								 projectTitle: fields.projectTitle,
								 startDate: fields.startDate,
								 endDate: fields.endDate,
								 forwarded: 0,
								 formName: req.user.firstName + ' ' + req.user.lastName + ' - ' + fields.projectTitle + ' - Form 7' + ' - ' + (c+1),
								 fieldDescription: fields.fieldDescription,
								 contactName: fields.contactName,
								 contactPhone: fields.contactPhone,
								 callHome: fields.callHome,
								 emergency: fields.emergency,
								 transport: fields.transport,
								 itinDate: fields.itinDate,
								 itinLocation: fields.itinLocation,
								 itinAccomodation: fields.itinAccomodation,
								 itinPhone: fields.itinPhone,
								 decName: fields.decName,
								 decPhone: fields.decPhone,
								 decVolunteer: fields.decVolunteer,
								 decCollaborator: fields.decCollaborator,
								 decApproved: fields.decApproved,
								 dec4WD: fields.dec4WD,
								 decOffRoad: fields.decOffRoad,
								 decAid: fields.decAid,
								 aggreement: fields.agreement,
								 fcname: fields.fcname,
								 fcemail: fields.fcemail,
								 fcdate: fields.fcdate,
								 leaderName: fields.leaderName,
								 leaderemail: fields.leaderemail,
								 leaderDate: fields.leaderDate,
								 supervisorName: fields.supervisorName,
								 supemail: fields.supemail,
								 supervisorDate: fields.supervisorDate,
								 hosName: fields.hosName,
								 hosemail: fields.hosemail,
								 hosDate: fields.hosDate,
								 permission: fields.permission,
								 DBSOcheck: fields.DBSO,
								 riskformcheck: fields.riskform,
								 dateFilled: today }), function(err, form7) {
								 if(err) {
									console.log(err);
									return res.status(500).send('Database post error');
								 }


										console.log(form7);
										console.log(files.filetoupload.length);
										if (typeof files.filetoupload.length == "undefined"){ //check the amount of files uploaded
											//if undefined there is either one file or none, if none the below code does nothing
											var name = files.filetoupload.name; // name of the uploaded file
											console.log(name.substr(name.length - 4)); // file names last 4 characters

											if (name.substr(name.length - 4) == ".pdf"){ //check its extension is .pdf
												// finds the path in the temp folder of the uploaded file and reads it
												var oldpath = files.filetoupload.path;
												var archivobin = fs.readFileSync(oldpath);
												console.log("Loading file");
												console.log(archivobin);
												//convert file to binary object
												var added = {};
												added.bin = Binary(archivobin);

												console.log("largo de invoice.bin= "+ added.bin.length());
												  if(err) console.log(err);
												  // check the inserted document is of correct length
													if (added.bin.length() > 0 && added.bin.length() < 10000000){
														console.log("Inserting file");
														console.log(added.bin);
														console.log(typeof added.bin);
													// update form 7 collection and this documents file field by pushing the uploaded file to it
													  Form7.update({ _id: form7.id }, { $push : { file : added.bin} }, function(err, form7) {
														   if(err) console.log(err);
													  });
													}

												else{ // file was <0MB or >10MB
													console.log("file too big");
												}
											}
										}

										else{ // there were multiple files uploaded
											console.log("enteredq");
											for (var i = 0; i < files.filetoupload.length; i ++){ // runs once for each uploaded file, each file found with file[i]
												// get name of file and check the last 4 characters are .pdf
												var name = files.filetoupload[i].name;
												console.log(name.substr(name.length - 4));

												if (name.substr(name.length - 4) == ".pdf"){

													var oldpath = files.filetoupload[i].path;

													var archivobin = fs.readFileSync(oldpath);
													// convert the file to a binary object
													console.log("Loading file");
													console.log(archivobin);

													var added = {};
													added.bin = Binary(archivobin);

													console.log("largo de invoice.bin= "+ added.bin.length());
													if(err) console.log(err);
												  // check the inserted document
													if (added.bin.length() > 0 && added.bin.length() < 10000000){// check the legnth is between 0MB and 10MB
														console.log("Inserting file");
														console.log(added.bin);
														console.log(typeof added.bin);
														// update form 7 collection and this documents file field by pushing the uploaded file to it
														Form7.update({ _id: form7.id }, { $push : { file : added.bin} }, function(err, form7) {
															if(err) console.log(err);
														});
													}
												}
											}
										}
									});

								 res.redirect('/dashboard');

		});
	});
});


//Review existing form7 (this is for admin use only)
router.post('/form7Review/:id', function(req, res) {
	console.log("review");
	var form = new formidable.IncomingForm();
	form.multiples = true;
	//console.log(form.bytesReceived);
	form.parse(req, function (err, fields, files) {

      Form7.findOne({ _id : req.params.id }, function(err, form7) {
          if(err) {
            console.log(err);
            res.status(500).post("Database update error");
          }
          form7.admin = fields.fcemail;     //Goes back to fieldwork coordinator
          form7.state = 'Reviewed by Admin';
          form7.forwarded = 0;
          form7.projectTitle = fields.projectTitle;
          form7.startDate = fields.startDate;
          form7.endDate = fields.endDate;
          form7.fieldDescription = fields.fieldDescription;
          form7.contactName = fields.contactName;
          form7.contactPhone = fields.contactPhone;
          form7.callHome = fields.callHome;
          form7.emergency = fields.emergency;
          form7.collaborator = fields.collaborator;
          form7.transport = fields.transport;
          form7.itinDate = fields.itinDate;
          form7.itinLocation = fields.itinLocation;
          form7.itinAccomodation = fields.itinAccomodation;
          form7.itinPhone = fields.itinPhone;
          form7.decName = fields.decName;
          form7.decPhone = fields.decPhone;
          form7.decVolunteer = fields.decVolunteer;
          form7.decCollaborator = fields.decCollaborator;
          form7.decApproved = fields.decApproved;
          form7.dec4WD = fields.dec4WD;
          form7.decOffRoad = fields.decOffRoad;
          form7.decAid = fields.decAid;
          form7.aggreement = fields.agreement;
          form7.fcname = fields.fcname;
          form7.fcemail = fields.fcemail;
          form7.fcdate = fields.fcdate;
          form7.leaderName = fields.leaderName;
          form7.leaderemail = fields.leaderemail;
          form7.leaderDate = fields.leaderDate;
          form7.supervisorName = fields.supervisorName;
          form7.supemail = fields.supemail;
          form7.supervisorDate = fields.supervisorDate;
          form7.hosName = fields.hosName;
          form7.hosemail = fields.hosemail;
          form7.hosDate = fields.hosDate;
          form7.permission = fields.permission;
          form7.DBSOcheck = fields.DBSO;
          form7.comm1 = fields.form7comm1;
          form7.comm2 = fields.form7comm2;
          form7.comm3 = fields.form7comm3;
          form7.comm4 = fields.form7comm4;
          form7.comm5 = fields.form7comm5;
          form7.riskformcheck = fields.riskform;
          form7.save();
          console.log(form7);

        });

	});
        res.redirect('/dashboard');

});

//Review existing form 7 (used by the user who submitted the form)
router.post('/form7StudentReview/:id', function(req, res) {
	console.log("student review");
	var form = new formidable.IncomingForm();
	form.multiples = true;
	//console.log(form.bytesReceived);
	form.parse(req, function (err, fields, files) {

      Form7.findOne({ _id : req.params.id }, function(err, form7) {
          if(err) {
            console.log(err);
            res.status(500).post("Database update error");
          }

          form7.state = 'Reviewed by User';
          form7.projectTitle = fields.projectTitle;
          form7.startDate = fields.startDate;
          form7.endDate = fields.endDate;
          form7.fieldDescription = fields.fieldDescription;
          form7.contactName = fields.contactName;
          form7.contactPhone = fields.contactPhone;
          form7.callHome = fields.callHome;
          form7.emergency = fields.emergency;
          form7.collaborator = fields.collaborator;
          form7.transport = fields.transport;
          form7.itinDate = fields.itinDate;
          form7.itinLocation = fields.itinLocation;
          form7.itinAccomodation = fields.itinAccomodation;
          form7.itinPhone = fields.itinPhone;
          form7.decName = fields.decName;
          form7.decPhone = fields.decPhone;
          form7.decVolunteer = fields.decVolunteer;
          form7.decCollaborator = fields.decCollaborator;
          form7.decApproved = fields.decApproved;
          form7.dec4WD = fields.dec4WD;
          form7.decOffRoad = fields.decOffRoad;
          form7.decAid = fields.decAid;
          form7.aggreement = fields.agreement;
          form7.fcname = fields.fcname;
          form7.fcemail = fields.fcemail;
          form7.fcdate = fields.fcdate;
          form7.leaderName = fields.leaderName;
          form7.leaderemail = fields.leaderemail;
          form7.leaderDate = fields.leaderDate;
          form7.supervisorName = fields.supervisorName;
          form7.supemail = fields.supemail;
          form7.supervisorDate = fields.supervisorDate;
          form7.hosName = fields.hosName;
          form7.hosemail = fields.hosemail;
          form7.hosDate = fields.hosDate;
          form7.permission = fields.permission;
          form7.DBSOcheck = fields.DBSO;
          form7.riskformcheck = fields.riskform;
          form7.save();
          console.log(form7);

		// Check the amount of uploaded files
		if (typeof files.filetoupload.length == "undefined"){
			//if undefined there is either one file or none, if none the below code does nothing

			//check file has the .pdf extension
			var name = files.filetoupload.name;
			console.log(name.substr(name.length - 4));

			if (name.substr(name.length - 4) == ".pdf"){
				// convert file to binary object
				var oldpath = files.filetoupload.path;
				var archivobin = fs.readFileSync(oldpath);
				console.log("Loading file m m m m ");
				console.log(archivobin);

				var added = {};
				added.bin = Binary(archivobin);

				console.log("largo de invoice.bin= "+ added.bin.length());
				if (added.bin.length() > 0 && added.bin.length() < 10000000){ // check file size is between 0MB and 10MB
					// unset the file field in this form 7 document so the newly uploaded files are the only ones stored
					Form7.update({ _id: form7.id }, { $unset : { file : ""} }, function(err, form7) {
							   if(err) console.log(err);
						  });
					if(err) console.log(err);
					// check the inserted document
					console.log("Inserting file");
					console.log(added.bin);
					console.log(typeof added.bin);
					// push the newly uploaded file to the file field which is an array
					Form7.update({ _id: form7.id }, { $push : { file : added.bin} }, function(err, form7) {
						if(err) console.log(err);
					});
				}
			}
		}

		else{ // multiple files in the upload
			console.log("enteredq");
			// unset the fiel field so it does not contain old data
			Form7.update({ _id: form7.id }, { $unset : { file : ""} }, function(err, form7) {
				if(err) console.log(err);
			});

			// for every uploaded file denoted by file[i]
			for (var i = 0; i < files.filetoupload.length; i ++){

				// make sure extension is .pdf
				var name = files.filetoupload[i].name;
				console.log(name.substr(name.length - 4));

				if (name.substr(name.length - 4) == ".pdf"){
					// convert file to binary object
					var oldpath = files.filetoupload[i].path;
					var archivobin = fs.readFileSync(oldpath);
					console.log("Loading file");
					console.log(archivobin);

					var added = {};
					added.bin = Binary(archivobin);

					console.log("largo de invoice.bin= "+ added.bin.length());
					if(err) console.log(err);
					  // check the inserted document
					if (added.bin.length() > 0 && added.bin.length() < 10000000){ // check file is between 0 MB and 10MB
						console.log("Inserting file");
						console.log(added.bin);
						console.log(typeof added.bin);
						// push current file to file field array
						Form7.update({ _id: form7.id }, { $push : { file : added.bin} }, function(err, form7) {
						   if(err) console.log(err);
						});
					}
				}
			}
		}

	  });


	});
        res.redirect('/dashboard');

});

//Forward the form to the relevant admin
router.post('/form7Forward/:id', function(req, res) {
  var form = new formidable.IncomingForm();
	form.multiples = true;
	//console.log(form.bytesReceived);
	form.parse(req, function (err, fields) {
    Form7.findOne( { _id : req.params.id }, function(err, form7) {
      if(err) {
        console.log(err);
        res.status(500).post("Forwarding error");
      }
      // If forwarded is 0 then the form has never been forwarded before so send to the supervisor
      if(form7.forwarded == 0) {
        form7.state = "Forwarded by Admin";
        form7.forwarded = 1;
        form7.admin = fields.supemail;
        form7.projectTitle = fields.projectTitle;
        form7.startDate = fields.startDate;
        form7.endDate = fields.endDate;
        form7.fieldDescription = fields.fieldDescription;
        form7.contactName = fields.contactName;
        form7.contactPhone = fields.contactPhone;
        form7.callHome = fields.callHome;
        form7.emergency = fields.emergency;
        form7.collaborator = fields.collaborator;
        form7.transport = fields.transport;
        form7.itinDate = fields.itinDate;
        form7.itinLocation = fields.itinLocation;
        form7.itinAccomodation = fields.itinAccomodation;
        form7.itinPhone = fields.itinPhone;
        form7.decName = fields.decName;
        form7.decPhone = fields.decPhone;
        form7.decVolunteer = fields.decVolunteer;
        form7.decCollaborator = fields.decCollaborator;
        form7.decApproved = fields.decApproved;
        form7.dec4WD = fields.dec4WD;
        form7.decOffRoad = fields.decOffRoad;
        form7.decAid = fields.decAid;
        form7.aggreement = fields.agreement;
        form7.fcname = fields.fcname;
        form7.fcemail = fields.fcemail;
        form7.fcdate = fields.fcdate;
        form7.leaderName = fields.leaderName;
        form7.leaderemail = fields.leaderemail;
        form7.leaderDate = fields.leaderDate;
        form7.supervisorName = fields.supervisorName;
        form7.supemail = fields.supemail;
        form7.supervisorDate = fields.supervisorDate;
        form7.hosName = fields.hosName;
        form7.hosemail = fields.hosemail;
        form7.hosDate = fields.hosDate;
        form7.permission = fields.permission;
        form7.comm1 = fields.form7comm1;
        form7.comm2 = fields.form7comm2;
        form7.comm3 = fields.form7comm3;
        form7.comm4 = fields.form7comm4;
        form7.comm5 = fields.form7comm5;
        form7.DBSOcheck = fields.DBSO;
        form7.riskformcheck = fields.riskform;
        form7.save();
        res.redirect('/dashboard');
      }
      // If forwarded is 1, the form has been forwarded once, send to head of school
      else if(form7.forwarded == 1) {
        form7.state = "Forwarded by Admin";
        form7.forwarded = 2;
        form7.admin = fields.hosemail;
        form7.projectTitle = fields.projectTitle;
        form7.startDate = fields.startDate;
        form7.endDate = fields.endDate;
        form7.fieldDescription = fields.fieldDescription;
        form7.contactName = fields.contactName;
        form7.contactPhone = fields.contactPhone;
        form7.callHome = fields.callHome;
        form7.emergency = fields.emergency;
        form7.collaborator = fields.collaborator;
        form7.transport = fields.transport;
        form7.itinDate = fields.itinDate;
        form7.itinLocation = fields.itinLocation;
        form7.itinAccomodation = fields.itinAccomodation;
        form7.itinPhone = fields.itinPhone;
        form7.decName = fields.decName;
        form7.decPhone = fields.decPhone;
        form7.decVolunteer = fields.decVolunteer;
        form7.decCollaborator = fields.decCollaborator;
        form7.decApproved = fields.decApproved;
        form7.dec4WD = fields.dec4WD;
        form7.decOffRoad = fields.decOffRoad;
        form7.decAid = fields.decAid;
        form7.aggreement = fields.agreement;
        form7.fcname = fields.fcname;
        form7.fcemail = fields.fcemail;
        form7.fcdate = fields.fcdate;
        form7.leaderName = fields.leaderName;
        form7.leaderemail = fields.leaderemail;
        form7.leaderDate = fields.leaderDate;
        form7.supervisorName = fields.supervisorName;
        form7.supemail = fields.supemail;
        form7.supervisorDate = fields.supervisorDate;
        form7.hosName = fields.hosName;
        form7.hosemail = fields.hosemail;
        form7.hosDate = fields.hosDate;
        form7.permission = fields.permission;
        form7.comm1 = fields.form7comm1;
        form7.comm2 = fields.form7comm2;
        form7.comm3 = fields.form7comm3;
        form7.comm4 = fields.form7comm4;
        form7.comm5 = fields.form7comm5;
        form7.DBSOcheck = fields.DBSO;
        form7.riskformcheck = fields.riskform;
        form7.save();
        res.redirect('/dashboard');
      }
      //If the form has been forwarded twice, it is completed
      else if(form7.forwarded == 2) {
        form7.state = "Complete";
        form7.forwarded = 3;
        form7.admin = '';     //Set admin to blank so it doesn't show up on admin dashboard
        form7.projectTitle = fields.projectTitle;
        form7.startDate = fields.startDate;
        form7.endDate = fields.endDate;
        form7.fieldDescription = fields.fieldDescription;
        form7.contactName = fields.contactName;
        form7.contactPhone = fields.contactPhone;
        form7.callHome = fields.callHome;
        form7.emergency = fields.emergency;
        form7.collaborator = fields.collaborator;
        form7.transport = fields.transport;
        form7.itinDate = fields.itinDate;
        form7.itinLocation = fields.itinLocation;
        form7.itinAccomodation = fields.itinAccomodation;
        form7.itinPhone = fields.itinPhone;
        form7.decName = fields.decName;
        form7.decPhone = fields.decPhone;
        form7.decVolunteer = fields.decVolunteer;
        form7.decCollaborator = fields.decCollaborator;
        form7.decApproved = fields.decApproved;
        form7.dec4WD = fields.dec4WD;
        form7.decOffRoad = fields.decOffRoad;
        form7.decAid = fields.decAid;
        form7.aggreement = fields.agreement;
        form7.fcname = fields.fcname;
        form7.fcemail = fields.fcemail;
        form7.fcdate = fields.fcdate;
        form7.leaderName = fields.leaderName;
        form7.leaderemail = fields.leaderemail;
        form7.leaderDate = fields.leaderDate;
        form7.supervisorName = fields.supervisorName;
        form7.supemail = fields.supemail;
        form7.supervisorDate = fields.supervisorDate;
        form7.hosName = fields.hosName;
        form7.hosemail = fields.hosemail;
        form7.hosDate = fields.hosDate;
        form7.permission = fields.permission;
        form7.comm1 = fields.form7comm1;
        form7.comm2 = fields.form7comm2;
        form7.comm3 = fields.form7comm3;
        form7.comm4 = fields.form7comm4;
        form7.comm5 = fields.form7comm5;
        form7.DBSOcheck = fields.DBSO;
        form7.riskformcheck = fields.riskform;
        form7.save();
        res.redirect('/form7Print/' + req.params.id);
      }
    });
  });
});

// Creates a new risk assessment form
router.post('/riskAssForm/:username', function(req, res) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd;
  }
  if(mm<10){
    mm='0'+mm;
  }
  var today = dd+'/'+mm+'/'+yyyy;
  Form7.count({owner: req.user.username}, function(err, c) {
    RiskAssForm.create(new RiskAssForm({ owner: req.user.username,
                                         admin: req.body.fcemail,  //Go to fieldwork coordinator
                                         state: 'Pending',
                                         forwarded: 0,
                                         formName: req.user.firstName + ' ' + req.user.lastName + ' - ' + req.body.title + ' - Risk Assessment Form' + ' - ' + c,
                                         Location: req.body.location,
                                         assesdate: req.body.assesdate,
                                         assessor: req.body.assessor,
                                         peer: req.body.peer,
                                         title: req.body.title,
                                         people: req.body.people,
                                         expdate: req.body.expdate,
                                         activitydesc: req.body.activitydesc,
                                         workconditions: req.body.workconditions,
                                         Gname: req.body.Gname,
                                         Gcomment: req.body.Gcomment,
                                         GIRC: req.body.GIRC,
                                         GIRL: req.body.GIRL,
                                         GIRE: req.body.GIRE,
                                         GCT: req.body.GCT,
                                         Gmeasure: req.body.Gmeasure,
                                         GRRC: req.body.GRRC,
                                         GRRL: req.body.GRRL,
                                         GRRE: req.body.GRRE,
                                         Ename: req.body.Ename,
                                         Ecomment: req.body.Ecomment,
                                         EIRC: req.body.EIRC,
                                         EIRL: req.body.EIRL,
                                         EIRE: req.body.EIRE,
                                         ECT: req.body.ECT,
                                         Emeasure: req.body.Emeasure,
                                         ERRC: req.body.ERRC,
                                         ERRL: req.body.ERRL,
                                         ERRE: req.body.ERRE,
                                         Fname: req.body.Fname,
                                         Fcomment: req.body.Fcomment,
                                         FIRC: req.body.FIRC,
                                         FIRL: req.body.FIRL,
                                         FIRE: req.body.FIRE,
                                         FCT: req.body.FCT,
                                         Fmeasure: req.body.Fmeasure,
                                         FRRC: req.body.FRRC,
                                         FRRL: req.body.FRRL,
                                         FRRE: req.body.FRRE,
                                         Oname: req.body.Oname,
                                         Ocomment: req.body.Ocomment,
                                         OIRC: req.body.OIRC,
                                         OIRL: req.body.OIRL,
                                         OIRE: req.body.OIRE,
                                         OCT: req.body.OCT,
                                         Omeasure: req.body.Omeasure,
                                         ORRC: req.body.ORRC,
                                         ORRL: req.body.ORRL,
                                         ORRE: req.body.ORRE,
                                         montime: req.body.montime,
                                         fcname: req.body.fcname,
                                         fcemail: req.body.fcemail,
                                         fcdate: req.body.fcdate,
                                         supname: req.body.supname,
                                         supemail: req.body.supemail,
                                         supdate: req.body.supdate,
                                         headname: req.body.headname,
                                         heademail: req.body.heademail,
                                         headdate: req.body.headdate,
                                         Gcontrolnum: req.body.Gcontrolnum,
                                         Econtrolnum: req.body.Econtrolnum,
                                         Fcontrolnum: req.body.Fcontrolnum,
                                         Ocontrolnum: req.body.Ocontrolnum,
                                         dateFilled: today }), function(err, form1) {

                             if(err) {
                                console.log(err);
                                return res.status(500).send('Database post error');
                             }

                            console.log(form1);

                             res.redirect('/dashboard');
                             });
                           });
});

//Reviews an existing risk assessment form (admin use only)
router.post('/riskAssFormReview/:id', function(req, res) {
      RiskAssForm.findOne({ _id : req.params.id }, function(err, riskform) {
          if(err) {
            console.log(err);
            res.status(500).post("Database update error");
          }
          riskform.admin = req.body.fcemail;     //Go to fieldwork coordinator
          riskform.state = 'Reviewed by Admin';
          riskform.forwarded = 0;
          riskform.Location = req.body.location;
          riskform.assesdate = req.body.assesdate;
          riskform.assessor = req.body.assessor;
          riskform.peer = req.body.peer;
          riskform.title = req.body.title;
          riskform.people = req.body.people;
          riskform.expdate = req.body.expdate;
          riskform.activitydesc = req.body.activitydesc;
          riskform.workconditions = req.body.workconditions;
          riskform.Gname = req.body.Gname;
          riskform.Gcomment = req.body.Gcomment;
          riskform.GIRC = req.body.GIRC;
          riskform.GIRL = req.body.GIRL;
          riskform.GIRE = req.body.GIRE;
          riskform.GCT = req.body.GCT;
          riskform.Gmeasure = req.body.Gmeasure;
          riskform.GRRC = req.body.GRRC;
          riskform.GRRL = req.body.GRRL;
          riskform.GRRE = req.body.GRRE;
          riskform.Ename = req.body.Ename;
          riskform.Ecomment = req.body.Ecomment;
          riskform.EIRC = req.body.EIRC;
          riskform.EIRL = req.body.EIRL;
          riskform.EIRE = req.body.EIRE;
          riskform.ECT = req.body.ECT;
          riskform.Emeasure = req.body.Emeasure;
          riskform.ERRC = req.body.ERRC;
          riskform.ERRL = req.body.ERRL;
          riskform.ERRE = req.body.ERRE;
          riskform.Fname = req.body.Fname;
          riskform.Fcomment = req.body.Fcomment;
          riskform.FIRC = req.body.FIRC;
          riskform.FIRL = req.body.FIRL;
          riskform.FIRE = req.body.FIRE;
          riskform.FCT = req.body.FCT;
          riskform.Fmeasure = req.body.Fmeasure;
          riskform.FRRC = req.body.FRRC;
          riskform.FRRL = req.body.FRRL;
          riskform.FRRE = req.body.FRRE;
          riskform.Oname = req.body.Oname;
          riskform.Ocomment = req.body.Ocomment;
          riskform.OIRC = req.body.OIRC;
          riskform.OIRL = req.body.OIRL;
          riskform.OIRE = req.body.OIRE;
          riskform.OCT = req.body.OCT;
          riskform.Omeasure = req.body.Omeasure;
          riskform.ORRC = req.body.ORRC;
          riskform.ORRL = req.body.ORRL;
          riskform.ORRE = req.body.ORRE;
          riskform.montime = req.body.montime;
          riskform.supname = req.body.supname;
          riskform.supemail = req.body.supemail;
          riskform.supdate = req.body.supdate;
          riskform.headname = req.body.headname;
          riskform.heademail = req.body.heademail;
          riskform.headdate = req.body.headdate;
          riskform.Gcontrolnum = req.body.Gcontrolnum;
          riskform.Econtrolnum = req.body.Econtrolnum;
          riskform.Fcontrolnum = req.body.Fcontrolnum;
          riskform.Ocontrolnum = req.body.Ocontrolnum;
          riskform.comment1 = req.body.comment1;
          riskform.comment2 = req.body.comment2;
          riskform.Greview = req.body.Greview;
          riskform.Ereview = req.body.Ereview;
          riskform.Freview = req.body.Freview;
          riskform.Oreview = req.body.Oreview;
          riskform.fcname = req.body.fcname;
          riskform.fcemail = req.body.fcemail;
          riskform.fcdate = req.body.fcdate;
          riskform.save();
        });
        res.redirect('/dashboard');

});

//Reviews an already existing risk assessment form (used by the person who submitted the form)
router.post('/riskAssFormStudentReview/:id', function(req, res) {
      RiskAssForm.findOne({ _id : req.params.id }, function(err, riskform) {
          if(err) {
            console.log(err);
            res.status(500).post("Database update error");
          }
          riskform.state = 'Reviewed by User';
          riskform.Location = req.body.location;
          riskform.assesdate = req.body.assesdate;
          riskform.assessor = req.body.assessor;
          riskform.peer = req.body.peer;
          riskform.title = req.body.title;
          riskform.people = req.body.people;
          riskform.expdate = req.body.expdate;
          riskform.activitydesc = req.body.activitydesc;
          riskform.adddescfile = req.body.adddescfile;
          riskform.workconditions = req.body.workconditions;
          riskform.Gname = req.body.Gname;
          riskform.Gcomment = req.body.Gcomment;
          riskform.GIRC = req.body.GIRC;
          riskform.GIRL = req.body.GIRL;
          riskform.GIRE = req.body.GIRE;
          riskform.GCT = req.body.GCT;
          riskform.Gmeasure = req.body.Gmeasure;
          riskform.GRRC = req.body.GRRC;
          riskform.GRRL = req.body.GRRL;
          riskform.GRRE = req.body.GRRE;
          riskform.Ename = req.body.Ename;
          riskform.Ecomment = req.body.Ecomment;
          riskform.EIRC = req.body.EIRC;
          riskform.EIRL = req.body.EIRL;
          riskform.EIRE = req.body.EIRE;
          riskform.ECT = req.body.ECT;
          riskform.Emeasure = req.body.Emeasure;
          riskform.ERRC = req.body.ERRC;
          riskform.ERRL = req.body.ERRL;
          riskform.ERRE = req.body.ERRE;
          riskform.Fname = req.body.Fname;
          riskform.Fcomment = req.body.Fcomment;
          riskform.FIRC = req.body.FIRC;
          riskform.FIRL = req.body.FIRL;
          riskform.FIRE = req.body.FIRE;
          riskform.FCT = req.body.FCT;
          riskform.Fmeasure = req.body.Fmeasure;
          riskform.FRRC = req.body.FRRC;
          riskform.FRRL = req.body.FRRL;
          riskform.FRRE = req.body.FRRE;
          riskform.Oname = req.body.Oname;
          riskform.Ocomment = req.body.Ocomment;
          riskform.OIRC = req.body.OIRC;
          riskform.OIRL = req.body.OIRL;
          riskform.OIRE = req.body.OIRE;
          riskform.OCT = req.body.OCT;
          riskform.Omeasure = req.body.Omeasure;
          riskform.ORRC = req.body.ORRC;
          riskform.ORRL = req.body.ORRL;
          riskform.ORRE = req.body.ORRE;
          riskform.montime = req.body.montime;
          riskform.supname = req.body.supname;
          riskform.supemail = req.body.supemail;
          riskform.supdate = req.body.supdate;
          riskform.headname = req.body.headname;
          riskform.heademail = req.body.heademail;
          riskform.headdate = req.body.headdate;
          riskform.Gcontrolnum = req.body.Gcontrolnum;
          riskform.Econtrolnum = req.body.Econtrolnum;
          riskform.Fcontrolnum = req.body.Fcontrolnum;
          riskform.Ocontrolnum = req.body.Ocontrolnum;
          riskform.fcname = req.body.fcname;
          riskform.fcemail = req.body.fcemail;
          riskform.fcdate = req.body.fcdate;
          riskform.save();
        console.log(riskform);});
        res.redirect('/dashboard');

});

//Forwards the risk assessment form to the relevant admin
router.post('/riskAssForward/:id', function(req, res) {
    RiskAssForm.findOne( { _id : req.params.id }, function(err, riskform) {
      if(err) {
        console.log(err);
        res.status(500).post("Forwarding error");
      }
      //If forwarded is 0, the form has never been forwarded and goes to the supervisor
      if(riskform.forwarded == 0) {
        riskform.state = "Forwarded by Admin";
        riskform.forwarded = 1;
        riskform.admin = req.body.supemail;
        riskform.Location = req.body.location;
        riskform.assesdate = req.body.assesdate;
        riskform.assessor = req.body.assessor;
        riskform.peer = req.body.peer;
        riskform.title = req.body.title;
        riskform.people = req.body.people;
        riskform.expdate = req.body.expdate;
        riskform.activitydesc = req.body.activitydesc;
        riskform.adddescfile = req.body.adddescfile;
        riskform.workconditions = req.body.workconditions;
        riskform.Gname = req.body.Gname;
        riskform.Gcomment = req.body.Gcomment;
        riskform.GIRC = req.body.GIRC;
        riskform.GIRL = req.body.GIRL;
        riskform.GIRE = req.body.GIRE;
        riskform.GCT = req.body.GCT;
        riskform.Gmeasure = req.body.Gmeasure;
        riskform.GRRC = req.body.GRRC;
        riskform.GRRL = req.body.GRRL;
        riskform.GRRE = req.body.GRRE;
        riskform.Ename = req.body.Ename;
        riskform.Ecomment = req.body.Ecomment;
        riskform.EIRC = req.body.EIRC;
        riskform.EIRL = req.body.EIRL;
        riskform.EIRE = req.body.EIRE;
        riskform.ECT = req.body.ECT;
        riskform.Emeasure = req.body.Emeasure;
        riskform.ERRC = req.body.ERRC;
        riskform.ERRL = req.body.ERRL;
        riskform.ERRE = req.body.ERRE;
        riskform.Fname = req.body.Fname;
        riskform.Fcomment = req.body.Fcomment;
        riskform.FIRC = req.body.FIRC;
        riskform.FIRL = req.body.FIRL;
        riskform.FIRE = req.body.FIRE;
        riskform.FCT = req.body.FCT;
        riskform.Fmeasure = req.body.Fmeasure;
        riskform.FRRC = req.body.FRRC;
        riskform.FRRL = req.body.FRRL;
        riskform.FRRE = req.body.FRRE;
        riskform.Oname = req.body.Oname;
        riskform.Ocomment = req.body.Ocomment;
        riskform.OIRC = req.body.OIRC;
        riskform.OIRL = req.body.OIRL;
        riskform.OIRE = req.body.OIRE;
        riskform.OCT = req.body.OCT;
        riskform.Omeasure = req.body.Omeasure;
        riskform.ORRC = req.body.ORRC;
        riskform.ORRL = req.body.ORRL;
        riskform.ORRE = req.body.ORRE;
        riskform.montime = req.body.montime;
        riskform.supname = req.body.supname;
        riskform.supemail = req.body.supemail;
        riskform.supdate = req.body.supdate;
        riskform.headname = req.body.headname;
        riskform.heademail = req.body.heademail;
        riskform.headdate = req.body.headdate;
        riskform.Gcontrolnum = req.body.Gcontrolnum;
        riskform.Econtrolnum = req.body.Econtrolnum;
        riskform.Fcontrolnum = req.body.Fcontrolnum;
        riskform.Ocontrolnum = req.body.Ocontrolnum;
        riskform.fcname = req.body.fcname;
        riskform.fcemail = req.body.fcemail;
        riskform.fcdate = req.body.fcdate;
        riskform.save();
        res.redirect('/dashboard');
      }
      // If forwarded is 1, the form gets sent to the head of school
      else if(riskform.forwarded == 1) {
        riskform.state = "Forwarded by Admin";
        riskform.forwarded = 2;
        riskform.admin = req.body.heademail;
        riskform.Location = req.body.location;
        riskform.assesdate = req.body.assesdate;
        riskform.assessor = req.body.assessor;
        riskform.peer = req.body.peer;
        riskform.title = req.body.title;
        riskform.people = req.body.people;
        riskform.expdate = req.body.expdate;
        riskform.activitydesc = req.body.activitydesc;
        riskform.adddescfile = req.body.adddescfile;
        riskform.workconditions = req.body.workconditions;
        riskform.Gname = req.body.Gname;
        riskform.Gcomment = req.body.Gcomment;
        riskform.GIRC = req.body.GIRC;
        riskform.GIRL = req.body.GIRL;
        riskform.GIRE = req.body.GIRE;
        riskform.GCT = req.body.GCT;
        riskform.Gmeasure = req.body.Gmeasure;
        riskform.GRRC = req.body.GRRC;
        riskform.GRRL = req.body.GRRL;
        riskform.GRRE = req.body.GRRE;
        riskform.Ename = req.body.Ename;
        riskform.Ecomment = req.body.Ecomment;
        riskform.EIRC = req.body.EIRC;
        riskform.EIRL = req.body.EIRL;
        riskform.EIRE = req.body.EIRE;
        riskform.ECT = req.body.ECT;
        riskform.Emeasure = req.body.Emeasure;
        riskform.ERRC = req.body.ERRC;
        riskform.ERRL = req.body.ERRL;
        riskform.ERRE = req.body.ERRE;
        riskform.Fname = req.body.Fname;
        riskform.Fcomment = req.body.Fcomment;
        riskform.FIRC = req.body.FIRC;
        riskform.FIRL = req.body.FIRL;
        riskform.FIRE = req.body.FIRE;
        riskform.FCT = req.body.FCT;
        riskform.Fmeasure = req.body.Fmeasure;
        riskform.FRRC = req.body.FRRC;
        riskform.FRRL = req.body.FRRL;
        riskform.FRRE = req.body.FRRE;
        riskform.Oname = req.body.Oname;
        riskform.Ocomment = req.body.Ocomment;
        riskform.OIRC = req.body.OIRC;
        riskform.OIRL = req.body.OIRL;
        riskform.OIRE = req.body.OIRE;
        riskform.OCT = req.body.OCT;
        riskform.Omeasure = req.body.Omeasure;
        riskform.ORRC = req.body.ORRC;
        riskform.ORRL = req.body.ORRL;
        riskform.ORRE = req.body.ORRE;
        riskform.montime = req.body.montime;
        riskform.supname = req.body.supname;
        riskform.supemail = req.body.supemail;
        riskform.supdate = req.body.supdate;
        riskform.headname = req.body.headname;
        riskform.heademail = req.body.heademail;
        riskform.headdate = req.body.headdate;
        riskform.Gcontrolnum = req.body.Gcontrolnum;
        riskform.Econtrolnum = req.body.Econtrolnum;
        riskform.Fcontrolnum = req.body.Fcontrolnum;
        riskform.Ocontrolnum = req.body.Ocontrolnum;
        riskform.fcname = req.body.fcname;
        riskform.fcemail = req.body.fcemail;
        riskform.fcdate = req.body.fcdate;
        riskform.save();
        res.redirect('/dashboard');
      }
      // If forwarded is 2, it has been signed off by the head of school
      else if(riskform.forwarded == 2) {
        riskform.state = "Complete";
        riskform.forwarded = 3;
        riskform.admin = '';     //Set admin to blank so it doesn't show up on admin dashboard
        riskform.Location = req.body.location;
        riskform.assesdate = req.body.assesdate;
        riskform.assessor = req.body.assessor;
        riskform.peer = req.body.peer;
        riskform.title = req.body.title;
        riskform.people = req.body.people;
        riskform.expdate = req.body.expdate;
        riskform.activitydesc = req.body.activitydesc;
        riskform.adddescfile = req.body.adddescfile;
        riskform.workconditions = req.body.workconditions;
        riskform.Gname = req.body.Gname;
        riskform.Gcomment = req.body.Gcomment;
        riskform.GIRC = req.body.GIRC;
        riskform.GIRL = req.body.GIRL;
        riskform.GIRE = req.body.GIRE;
        riskform.GCT = req.body.GCT;
        riskform.Gmeasure = req.body.Gmeasure;
        riskform.GRRC = req.body.GRRC;
        riskform.GRRL = req.body.GRRL;
        riskform.GRRE = req.body.GRRE;
        riskform.Ename = req.body.Ename;
        riskform.Ecomment = req.body.Ecomment;
        riskform.EIRC = req.body.EIRC;
        riskform.EIRL = req.body.EIRL;
        riskform.EIRE = req.body.EIRE;
        riskform.ECT = req.body.ECT;
        riskform.Emeasure = req.body.Emeasure;
        riskform.ERRC = req.body.ERRC;
        riskform.ERRL = req.body.ERRL;
        riskform.ERRE = req.body.ERRE;
        riskform.Fname = req.body.Fname;
        riskform.Fcomment = req.body.Fcomment;
        riskform.FIRC = req.body.FIRC;
        riskform.FIRL = req.body.FIRL;
        riskform.FIRE = req.body.FIRE;
        riskform.FCT = req.body.FCT;
        riskform.Fmeasure = req.body.Fmeasure;
        riskform.FRRC = req.body.FRRC;
        riskform.FRRL = req.body.FRRL;
        riskform.FRRE = req.body.FRRE;
        riskform.Oname = req.body.Oname;
        riskform.Ocomment = req.body.Ocomment;
        riskform.OIRC = req.body.OIRC;
        riskform.OIRL = req.body.OIRL;
        riskform.OIRE = req.body.OIRE;
        riskform.OCT = req.body.OCT;
        riskform.Omeasure = req.body.Omeasure;
        riskform.ORRC = req.body.ORRC;
        riskform.ORRL = req.body.ORRL;
        riskform.ORRE = req.body.ORRE;
        riskform.montime = req.body.montime;
        riskform.supname = req.body.supname;
        riskform.supemail = req.body.supemail;
        riskform.supdate = req.body.supdate;
        riskform.headname = req.body.headname;
        riskform.heademail = req.body.heademail;
        riskform.headdate = req.body.headdate;
        riskform.Gcontrolnum = req.body.Gcontrolnum;
        riskform.Econtrolnum = req.body.Econtrolnum;
        riskform.Fcontrolnum = req.body.Fcontrolnum;
        riskform.Ocontrolnum = req.body.Ocontrolnum;
        riskform.fcname = req.body.fcname;
        riskform.fcemail = req.body.fcemail;
        riskform.fcdate = req.body.fcdate;
        riskform.save();
        res.redirect('/riskAssFormPrint/' + req.params.id);
      }
    });
});

//Handles making a user admin
router.post('/makeAdmin/:id', function(req, res) {
    Account.findOne({_id : req.params.id }, function(err, acc) {
      if(err) {
        console.log(err);
        res.status(500).post("Database update error");
      }
      acc.admin = true;
      acc.save();
    });
    res.redirect('/admin');
});

//Handles revoking a user of admin priveleges
router.post('/revokeAdmin/:id', function(req, res) {
    Account.findOne({_id : req.params.id }, function(err, acc) {
      if(err) {
        console.log(err);
        res.status(500).post("Database update error");
      }
      acc.admin = false;
      acc.save();
    });
    res.redirect('/admin');
});

//Changes the password
router.post('/changePass/:id', function(req, res) {
    Account.findByUsername(req.user.username).then(function(sanitizedUser) {
        if(sanitizedUser){
            sanitizedUser.setPassword(req.body.password, function(){
                sanitizedUser.save();
                res.redirect('/dashboard');
            });
        } else {
            res.status(500).json({message: 'This user does not exist'});
        }
    },function(err) {
        console.error(err);
    });
});

//Handles the sending of emails when a user forgets their password
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Account.findOne({ username: req.body.email }, function(err, user) {
        if (!user) {
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'no.reply.UWAfieldwork@gmail.com',
          pass: 'Cits3200project'
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'passwordreset@demo.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

//Used for reseting the password of a user. This can only be accessed from the email sent to the user through the forgot password page
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          console.log("No user found");
          res.redirect('/');
        }

        user.setPassword(req.body.password, function() {
          user.save();
        });
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
            done(err, user);
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'no.reply.UWAfieldwork@gmail.com',
          pass: 'Cits3200project'
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

//Logout the current user
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//Handles fileuploads
router.post('/fileupload1', (req, res) => {
	console.log("hi1");
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		var name = files.filetoupload.name;
		console.log(name.substr(name.length - 4));

		if (name.substr(name.length - 4) == ".pdf"){
			var oldpath = files.filetoupload.path;
			var archivobin = fs.readFileSync(oldpath);
			// print it out so you can check that the file is loaded correctly
			console.log("Loading file");
			console.log(archivobin);

			var firstaid = {};
			firstaid.bin = Binary(archivobin);

			console.log("largo de invoice.bin= "+ firstaid.bin.length());
			if(err) console.log(err);
			if (firstaid.bin.length() > 0 && firstaid.bin.length() < 10000000){
			console.log("Inserting file");
			console.log(firstaid.bin);
			console.log(typeof firstaid.bin);
			Account.update({username: req.user.username}, {$set: {firstAid: firstaid.bin}}, function(err) {
				if(err) console.log(err);
				});
			}
		}
  });
  res.redirect('/dashboard');

});

router.post('/fileupload2', (req, res) => {
	console.log("hi2");
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		var name = files.filetoupload.name;
		console.log(name.substr(name.length - 4));

		if (name.substr(name.length - 4) == ".pdf"){
			var oldpath = files.filetoupload.path;

			var archivobin = fs.readFileSync(oldpath);
			// print it out so you can check that the file is loaded correctly
			console.log("Loading file");
			console.log(archivobin);

			var off = {};
			off.bin = Binary(archivobin);

			console.log("largo de invoice.bin= "+ off.bin.length());
			if(err) console.log(err);
			// check the inserted document
			if (off.bin.length() > 0 && off.bin.length() < 10000000){
			console.log("Inserting file");
				console.log(off.bin);
				console.log(typeof off.bin);
				Account.update({username: req.user.username}, {$set: {off: off.bin}}, function(err) {
					if(err) console.log(err);
				});
			}
		}
  });
  res.redirect('/dashboard');

});

router.post('/fileupload3', (req, res) => {
	console.log("hi3S");
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		var name = files.filetoupload.name;
		console.log(name.substr(name.length - 4));

		if (name.substr(name.length - 4) == ".pdf"){
			var oldpath = files.filetoupload.path;

			var archivobin = fs.readFileSync(oldpath);
			// print it out so you can check that the file is loaded correctly
			console.log("Loading file");
			console.log(archivobin);

			var licen = {};
			licen.bin = Binary(archivobin);

			console.log("largo de invoice.bin= "+ licen.bin.length());
			if(err) console.log(err);
			// check the inserted document

			if (licen.bin.length() > 0 && licen.bin.length() < 10000000){
				console.log("Inserting file");
				console.log(licen.bin);
				console.log(typeof licen.bin);
				Account.update({username: req.user.username}, {$set: {licence: licen.bin}}, function(err) {
					if(err) console.log(err);
					});
			}
		}
  });
  res.redirect('/dashboard');

});

module.exports = router;
