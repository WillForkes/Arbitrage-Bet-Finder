const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient()
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();
const paypal = require('paypal-rest-sdk');

// PayPal Setup
const clientId = (process.env.NODE_ENV == "development") ? process.env.PAYPAL_CLIENT_ID_SANDBOX : process.env.PAYPAL_CLIENT_ID_LIVE;
const clientSecret = (process.env.NODE_ENV == "development") ? process.env.PAYPAL_SECRET_SANDBOX : process.env.PAYPAL_SECRET_LIVE;

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

    paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            console.log("Create Billing Agreement Response");
            //console.log(billingAgreement);
            for (var index = 0; index < billingAgreement.links.length; index++) {
                if (billingAgreement.links[index].rel === 'approval_url') {
                    var approval_url = billingAgreement.links[index].href;
                    console.log("For approving subscription via Paypal, first redirect user to");
                    console.log(approval_url);

                    console.log("Payment token is");
                    console.log(url.parse(approval_url, true).query.token);
                    // See billing_agreements/execute.js to see example for executing agreement 
                    // after you have payment token
                }
            }
        }
    });
});



module.exports = router;
