const dotenv = require('dotenv').config();
const env = process.env.NODE_ENV || "development";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { PrismaClient } = require('@prisma/client')
const { auth } = require('express-openid-connect'); // * Auth0
let { checkUser } = require('./middleware/checkUser');

const prisma = new PrismaClient()
var app = express();

// * Setup libaries for express
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

app.use('/scraper', scraperRouter);
app.use('/tracker', trackerRouter);
app.use('/calculator', calculatorRouter);

// * Auth0 test
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', checkUser, async (req, res) => {
    const dbuser = await prisma.user.findUnique({
        where: {
            authid: req.oidc.user.sub
        }
    })
    res.json({"auth0": req.oidc.user, "dbuser": dbuser})
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
