const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Form1 = new Schema({
    owner: String,
    admin: String,
    state: String,    // Set to complete once form has been filled out
    name: String,
    idNumber: String,
    emerName1: String,
    emerName2: String,
    emerRelation1: String,
    emerRelation2: String,
    emerPhone1: String,
    emerPhone2: String,
    participation: Boolean,
    policy: Boolean,
    report: Boolean,
    policies: Boolean,
    drug: Boolean,
    aware: Boolean,
    training: Boolean,
    security: Boolean,
    vaccinations: Boolean,
    limitations: Boolean,
    fit: Boolean,
    medicalAdvice: Boolean,
    complete: Boolean,
    responsibility: Boolean,
    supervisor: Boolean,
    volunteer: Boolean,
    completed: Boolean,
    dateFilled: String,
    formName: String
});

module.exports = mongoose.model('Form1', Form1);
