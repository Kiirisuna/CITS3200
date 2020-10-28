const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: {type: String, unique: true},     //Email
    password: String,
    firstName: String,
    lastName: String,
	  firstAid: Buffer,
	  off: Buffer,
	  licence: Buffer,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    admin: {type: Boolean, default: false}
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);
