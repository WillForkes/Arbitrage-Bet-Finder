const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
const { checkUser } = require('../middleware/checkUser');
var router = express.Router();

// * Twilio for sms notifications
const TwilioSID = process.env.TWILIO_SID;
const TwilioAuth = process.env.TWILIO_AUTH;
const TwilioClient = require("twilio")(TwilioSID, TwilioAuth);

// * Nodemailer for email notifications
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service : process.env.EMAIL_SERVICE,
    auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
    }
});

router.post('/email', async function(req, res, next) {
    const {betid, authid} = req.body;

    if(!betid || !authid){
        res.status(500).json({"error": "Error sending email. No betid or authid supplied."})
        return;
    }

    // Get user and bet
    const user = await prisma.user.findUnique({
        where: {
            authid: authid
        }
    })
    const bet = await prisma.bet.findUnique({
        where: {
            id: parseInt(betid)
        }
    })

    if(!user || !bet){
        res.status(500).json({"error": "Error sending email. User or bet not found."})
        return;
    }

    // send email
    const betData = JSON.parse(bet.data)
    const profitPercentage = Math.round(((1 - betData.total_implied_odds) + Number.EPSILON) * 100) / 100
    const message = `Arbster notification: +${profitPercentage}% arbitrage opportunity found! Click here to view: https://arbster.app/bet/${betid}`
    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email, // list of receivers
        subject: 'Arbster Bet Notification',
        text: message, 
        html: '<b>HTML template not created yet...</b>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({"error": error})
            return
        }
        res.json({"status": "ok", "data": {"message": info}})
    });

});

router.post('/sms', async function(req, res, next) {
    const {betid, authid} = req.body;

    if(!betid || !authid){
        res.status(500).json({"error": "Error sending SMS. No betid or authid supplied."})
        return;
    }

    // Get user and bet
    const user = await prisma.user.findUnique({
        where: {
            authid: authid
        }
    })
    const bet = await prisma.bet.findUnique({
        where: {
            id: betid
        }
    })

    const betData = JSON.parse(bet.data)
    const toNumber = user.phone
    const profitPercentage = Math.round(((1 - betData.total_implied_odds) + Number.EPSILON) * 100) / 100
    const message = `Arbster notification: +${profitPercentage}% arbitrage opportunity found! Click here to view: https://arbster.app/bet/${betid}`

    TwilioClient.messages
    .create({ body: message, from: "+447888873579", to: toNumber })
    .then(message => {
        res.json({"status": "ok", "data": {"message": message}})
    })
    .catch(err => {
        res.status(500).json({"error": "Error sending SMS.", "details": err})
    });
});

module.exports = router;