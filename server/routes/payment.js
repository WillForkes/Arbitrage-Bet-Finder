const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient()
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();
const paypal = require('paypal-rest-sdk');
const axios = require('axios');

// PayPal Setup
const clientId = (process.env.NODE_ENV == "development") ? process.env.PAYPAL_CLIENT_ID_SANDBOX : process.env.PAYPAL_CLIENT_ID_LIVE;
const clientSecret = (process.env.NODE_ENV == "development") ? process.env.PAYPAL_SECRET_SANDBOX : process.env.PAYPAL_SECRET_LIVE;
const paypalBaseURL = (process.env.NODE_ENV == "development") ? "https://api-m.sandbox.paypal.com/" : "https://api.paypal.com";

paypal.configure({
    mode: 'sandbox', // Replace with 'live' when you're ready to go live
    client_id: clientId,
    client_secret: clientSecret
});

const plans = {
    development: {
        starter: "P-0V898368738325322MRJ5WCY",
        pro: "P-9GY62972LS0576048MRJ5WSA"
    },
    live: {
        starter: "P-5FP73547Y4167462XMRJJATY",
        pro: "P-3SR57382CD0013426MRJJAEI"
    }

}

//////////////////// ! FUNCTIONS ////////////////////
async function getSubscriptionPaypal(id) {
    paypal.billingPlan.get(id, function (error, billingPlan) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            return billingPlan;
        }
    });
}



//////////////////// ! PAYPAL ////////////////////
router.post('/create-subscription', async (req, res) => {
    const plan = req.body.plan; // Get the plan ID from the request body
    const planId = plans[process.env.NODE_ENV][plan]

    const now = new Date();
    const tenSecondsLater = new Date(now.getTime() + 10 * 1000);
    const isoFormat = tenSecondsLater.toISOString();
    var billingAgreementAttributes = {
        "name": "Arbster",
        "description": "Agreement for Fast Speed Plan",
        "start_date": isoFormat,
        "plan": {
            "id": planId
        },
        "payer": {
            "payment_method": "paypal"
        },
    };

    axios.post(paypalBaseURL + "/v1/billing/subscriptions", billingAgreementAttributes, {
        headers: {
            'Content-Type': 'application/json',
        }, auth: {
            username: clientId,
            password: clientSecret
        }
    })

});

async function getPayPalAuth() {
    //create basic authentication token header from client id and secret
    var auth = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');
    var headers = {
        'Accept': '*/*', 
        'Accept-Language': 'en_US',
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': auth
    }

    axios.post(paypalBaseURL + "/v1/oauth2/token", "grant_type=client_credentials", {
        headers: headers
    }).then(function (response) {
        console.log(response.data);
        return response.data;
    }).catch(function (error) {
        console.log(error.response.data);
    });
}

const ee = getPayPalAuth();

module.exports = router;
