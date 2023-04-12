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
let { checkStaff } = require('./middleware/checkStaff');
const prisma = new PrismaClient()
var app = express();
const { lookup } = require('geoip-lite'); // * Geolocation IP data
const schedule = require('node-schedule');
const axios = require('axios');



// * Setup libaries for express
app.use(logger('dev'));
app.use(express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    maxAge: 86400,
    credentials: true,
    origin: process.env.NODE_ENV == "development" ? "http://localhost:3001": "https://www.arbster.com"
}))


// * Auth0 Authenticaiton
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: (process.env.NODE_ENV == "development") ? process.env.SECRET_DEV : process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: (process.env.NODE_ENV == "development") ? process.env.CLIENTID_DEV : process.env.CLIENTID,
    issuerBaseURL: (process.env.NODE_ENV == "development") ? process.env.ISSUERBASEURL_DEV : process.env.ISSUERBASEURL
};
app.use(auth(config));

// * Routes
var scraperRouter = require('./routes/scraper');
var trackerRouter = require('./routes/tracker');
var calculatorRouter = require('./routes/calculator');
var profileRouter = require('./routes/profile');
var paymentRouter = require('./routes/payment');
var notificationRouter = require('./routes/notification');
var adminRouter = require('./routes/admin');
app.use('/scraper', scraperRouter);
app.use('/tracker', trackerRouter);
app.use('/calculator', calculatorRouter);
app.use('/profile', profileRouter);
app.use('/payment', paymentRouter);
app.use('/notification', notificationRouter);
app.use('/admin', adminRouter);


// * Essential base routes
app.get('/', (req, res) => {
    if(process.env.NODE_ENV == "development"){
        res.redirect('http://localhost:3001')
    } else {
        res.redirect('https://arbster.com')
    }
});

app.get('/sign-up', (req, res) => {
    res.oidc.login({
        authorizationParams: {
            screen_hint: 'signup',
        },
    });
});

app.get('/region', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const details = lookup(ip); // location of the user
    res.json({"status":"ok", "data": details})

    // * Example response
    // { 
    //     range: [ 3479298048, 3479300095 ],
    //     country: 'US',
    //     region: 'TX',
    //     eu: '0',
    //     timezone: 'America/Chicago',
    //     city: 'San Antonio',
    //     ll: [ 29.4969, -98.4032 ],
    //     metro: 641,
    //     area: 1000 
    // }
});

app.get('/isAuth', (req, res) => {
    // print cookies sent
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

// var PORT = process.env.PORT || 3000

// app.listen(PORT, () => {
//     console.log("listening on port" + process.env.PORT)
// })

if(process.env.NODE_ENV != "development") {
    schedule.scheduleJob('*/5 * * * *', async () => {
        console.log('Running Scraper');
        try {
            await axios.get('http://localhost:3000/scraper/run')
        } catch(e) {
            console.log(e)
        }
    });
}

module.exports = app;
