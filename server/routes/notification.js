const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
const { checkUser } = require('../middleware/checkUser');
var router = express.Router();

// * Twilio for sms notifications
const TwilioSID = process.env.TWILIO_SID;
const TwilioAuth = process.env.TWILIO_AUTH;
const TwilioServiceSID = process.env.TWILIO_MESSAGING_SERVICE_SID
const TwilioNotifySID = process.env.TWILIO_NOTIFY_SERVICE_SID
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
    const {betid, userids} = req.body;

    if(!betid || !userids){
        res.status(500).json({"error": "Error sending email. No betid or authid supplied."})
        return;
    }

    // Get user and bet
    const users = await prisma.user.findMany({
        where: {
            authid: {
                in: userids
            }
        }
    })
    const bet = await prisma.bet.findUnique({
        where: {
            id: parseInt(betid)
        }
    })

    if(!users || !bet){
        res.status(500).json({"error": "Error sending email. User or bet not found."})
        return;
    }

    // create list of emails
    const toEmails = users.map(user => user.email).join(',')

    // send email
    const betData = JSON.parse(bet.data)
    const profitPercentage = Math.round(((1 - betData.total_implied_odds) + Number.EPSILON) * 100) / 100
    const message = `Arbster notification: +${profitPercentage}% arbitrage opportunity found! Click here to view: https://arbster.com/bet/${betid}`
    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: toEmails,
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
    const {betid, userids} = req.body;

    if(!betid || !userids){
        res.status(500).json({"error": "Error sending SMS. No betid or authid supplied."})
        return;
    }

    // Get user and bet
    const users = await prisma.user.findMany({
        where: {
            authid: {
                in: userids
            }
        }
    })
    const bet = await prisma.bet.findUnique({
        where: {
            id: betid
        }
    })

    const betData = JSON.parse(bet.data)
    const profitPercentage = (bet.type == "ev") ? (betData.ev * 100).toFixed(2) : ((1 - betData.total_implied_odds) * 100).toFixed(2)
    const opportunity = (bet.type == "ev") ? "Positive EV" : "Arbitrage"
    const message = `Arbster notification: +${profitPercentage}% ${opportunity} opportunity found! Click here to view: https://arbster.com/bet/${betid}`

    // setup service
    const service = TwilioClient.notify.v1.services(TwilioNotifySID);

    // get array of phone numbers to send sms too from users
    const toNumbers = users.map(user => user.phone)
    
    // bindings for sms messages
    const bindings = toNumbers.map(number => {
        return JSON.stringify({ binding_type: 'sms', address: number });
    });

    service.notifications.create({
        toBinding: bindings,
        body: message
    })
    .then(notification => {
        res.json({"status": "ok", "data": {"message": notification}})
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({"error": "Error sending SMS.", "details": err})
    });
});

module.exports = router;
