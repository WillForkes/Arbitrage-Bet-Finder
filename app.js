const dotenv = require('dotenv').config();
const env = process.env.NODE_ENV || "development";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { auth } = require('express-openid-connect'); // * Auth0
const { requiresAuth } = require('express-openid-connect');
const { PrismaClient } = require('@prisma/client')
let { userExist } = require('./middleware/userExist');

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
app.use('/scraper', scraperRouter);
 
// * Auth0 test
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', [requiresAuth(), userExist], async (req, res) => {
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
  res.render('error');
});

module.exports = app;
