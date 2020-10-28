const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Form7 = new Schema({
    owner: String,
    admin: String,
    state: String,               //States include: ready, pending and complete
    projectTitle: String,
    startDate: String,          // So it shows up in form 7 review
    endDate: String,            // So it shows up in form 7 review
    fieldDescription: String,
    contactName: [String],
    contactPhone: [String],
    callHome: String,
    emergency: String,
    transport: String,
    itinDate: [String],       // So it shows up in form 7 review
    itinLocation: [String],
    itinAccomodation: [String],
    itinPhone: [String],
    decName: [String],
    decPhone: [String],
    decVolunteer: {type :[String]},
    decCollaborator: {type :[String]},
    decApproved: {type :[String]},
    dec4WD: {type :[String]},
    decOffRoad: {type :[String]},
    decAid: {type :[String]},
    agreement: {type : Boolean},
    fcname: String,
    fcemail: String,
    fcdate: String,
    leaderName: String,
    leaderemail: String,
    leaderDate: String,         // So it shows up in form 7 review
    supervisorName: String,
    supemail: String,
    supervisorDate: String,     // So it shows up in form 7 review
    hosName: String,
    hosemail: String,
    hosDate: String,            // So it shows up in form 7 review
    permission: {type : Boolean, default : false},
    DBSOcheck: Boolean,
    riskformcheck: Boolean,
    comm1 : String,
    comm2 : String,
    comm3 : String,
    comm4 : String,
    comm5 : String,
	file: [Buffer],
	  dateFilled: String,
    forwarded: Number,
    formName: String
});

module.exports = mongoose.model('Form7', Form7);
