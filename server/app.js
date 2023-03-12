const dotenv = require('dotenv').config();
const env = process.env.NODE_ENV || "development";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const { PrismaClient } = require('@prisma/client')
const { auth } = require('express-openid-connect'); // * Auth0
let { checkUser } = require('./middleware/checkUser');
const prisma = new PrismaClient()
var app = express();

// * Setup libaries for express
app.use(logger('dev'));
app.use(express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    maxAge: 86400,
    credentials: true,
    origin: "http://localhost:3001"
}))


// * Auth0 Authenticaiton
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL
};
app.use(auth(config));

// * Routes
var scraperRouter = require('./routes/scraper');
var trackerRouter = require('./routes/tracker');
var calculatorRouter = require('./routes/calculator');
var profileRouter = require('./routes/profile');
var paymentRouter = require('./routes/payment');

app.use('/scraper', scraperRouter);
app.use('/tracker', trackerRouter);
app.use('/calculator', calculatorRouter);
app.use('/profile', profileRouter);
app.use('/payment', paymentRouter);

app.get('/', (req, res) => {
    //res.json({"status":"ok", "data": "Welcome to the API"})
    res.redirect('http://localhost:3001/')
});

app.get('/isAuth', (req, res) => {
    // print cookies sent
    console.log(req.cookies);
    if(req.oidc.isAuthenticated()){
        res.json({
            "status": "ok",
            "data": {
                "authenticated":true
        }})
    }else{
        res.json({
            "status": "ok",
            "data": {
                "authenticated":false
        }})    
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if(env == "development"){
        res.json({"error": "Something went wrong", "message": err.message, "status": err.status || 500})
    }else{
        res.json({"error": "Something went wrong"})
    }       
});

module.exports = app;
