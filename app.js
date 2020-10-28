const express = require('express')
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const form1 = require('./routes/form1');
const form1Print = require('./routes/form1Print');
const register = require('./routes/register');
const riskAssForm = require('./routes/riskAssForm');
const riskAssFormReview = require('./routes/riskAssFormReview');
const riskAssFormStudentReview = require('./routes/riskAssFormStudentReview');
const riskAssFormPrint = require('./routes/riskAssFormPrint');
const form7 = require('./routes/form7');
const form7Review = require('./routes/form7Review');
const form7StudentReview = require('./routes/form7StudentReview');
const form7Print = require('./routes/form7Print');
const testAll = require('./routes/testAll');
const dashboard = require('./routes/dashboard');
const admin = require('./routes/admin');
const changePass = require('./routes/changePass');
const forgot = require('./routes/forgot');
const reset = require('./routes/reset');
const viewForms = require('./routes/viewForms');

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

//create static path
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// NPM package setup
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/form1', form1);
app.use('/form1Print', form1Print);
app.use('/register', register);
app.use('/riskAssForm', riskAssForm);
app.use('/riskAssFormReview', riskAssFormReview);
app.use('/riskAssFormStudentReview', riskAssFormStudentReview);
app.use('/riskAssFormPrint', riskAssFormPrint);
app.use('/form7', form7);
app.use('/form7Review', form7Review);
app.use('/form7StudentReview', form7StudentReview);
app.use('/form7Print', form7Print);
app.use('/testAll', testAll);
app.use('/dashboard', dashboard);
app.use('/admin', admin);
app.use('/changePass', changePass);
app.use('/forgot', forgot);
app.use('/reset', reset);
app.use('/viewForms', viewForms);

// passport config
const Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://usersAdmin:cits3200project@130.95.176.159:27017/users', {useMongoClient: true});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// For heroku and local deployment
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port 3000')
})

module.exports = app;
