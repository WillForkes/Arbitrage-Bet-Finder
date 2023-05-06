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
const paypalBaseURL = (process.env.NODE_ENV == "development") ? "https://api-m.sandbox.paypal.com" : "https://api.paypal.com";

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

//////////////////// ! PAYPAL ////////////////////
router.post('/create-subscription', async (req, res) => {
    const plan = req.body.plan; // Get the plan ID from the request body
    const planId = plans[process.env.NODE_ENV][plan]

    const authToken = await getPayPalAuth();
    const now = new Date();
    const tenSecondsLater = new Date(now.getTime() + 10 * 1000);
    const isoFormat = tenSecondsLater.toISOString();
    var billingAgreementAttributes = {
        "plan_id": planId,
        "start_time": isoFormat,
        "application_context": {
            "brand_name": "Arbster",
            "locale": "en-US",
            "user_action": "SUBSCRIBE_NOW",
            "payment_method": {
                "payer_selected": "PAYPAL",
                "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
            },
            "return_url": (process.env.NODE_ENV == "development") ? "http://localhost:3001/subscription/success" : "https://arbster.co.uk/subscription/success",
            "cancel_url": (process.env.NODE_ENV == "development") ? "http://localhost:3001/subscription/failure" : "https://arbster.co.uk/subscription/failure"
        }
    };

    try{
        const ppresp = await axios.post(paypalBaseURL + "/v1/billing/subscriptions", billingAgreementAttributes, {
            headers: {
                "Authorization": "Bearer " + authToken
            }
        })
        res.json(ppresp.data);
    } catch(err) {
        res.json({status: "error", message: err.response.data});
    }
});

router.get("/get-subscription/:id", async (req, res) => {
    const id = req.params.id;
    const authToken = await getPayPalAuth();
    const urisuf = "/v1/billing/subscriptions/" + id
    try{
        const ppresp = await axios.get(paypalBaseURL + urisuf, {
            headers: {
                "Authorization": "Bearer " + authToken,
                'Content-Type': 'application/json'
            }
        })
        res.json({status: "ok", "data":ppresp.data});
    } catch(err) {
        res.json({status: "error", message: err.response.data});
    }
})

router.post("/complete", checkUser, async (req, res) => {
    const subId = req.body.subscriptionId;
    const authToken = await getPayPalAuth();

    // * Check if subscription exists
    const sub = await prisma.subscription.findUnique({
        where: {
            paypalSubscriptionId: subId
        }
    })
    if(sub) {
        res.json({status: "ok", data: {message: "Subscription already exists!"}});
        return;
    }

    // * Get the subscription details from PayPal then put it into the database
    let ppresp
    try{
        ppresp = await axios.get(paypalBaseURL + "/v1/billing/subscriptions/" + subId, {
            headers: {
                "Authorization": "Bearer " + authToken,
                'Content-Type': 'application/json'
            }
        })
    } catch(err) {
        res.json({status: "error", message: err.response.data});
        return;
    }

    // * Update the user's subscription status
    const expiresAt = new Date(ppresp.data.billing_info.next_billing_time);
    const status = ppresp.data.status.toLowerCase();

    // get plan name from plans object
    const planName = Object.keys(plans[process.env.NODE_ENV]).find(key => plans[process.env.NODE_ENV][key] === ppresp.data.plan_id);

    const userSub = await prisma.subscription.create({
        data: {
            paypalSubscriptionId: subId,
            planExpiresAt: expiresAt,
            status: status,
            userId: req.user.authid,
            plan: planName
        }
    })
    
    //...

    res.json({status: "ok", data: {subscription: userSub}})
})

router.post("/cancel-subscription", checkUser, async (req, res) => {
    const authToken = await getPayPalAuth();

    // get subid
    const sub = await prisma.subscriptions.findUnique({
        where: {
            userId: req.user.id
        }
    })

    const urisuf = "/v1/billing/subscriptions/" + sub.paypalSubscriptionId + "/cancel"

    try {
        const ppresp = await axios.get(paypalBaseURL + urisuf, {
            headers: {
                "Authorization": "Bearer " + authToken,
                'Content-Type': 'application/json'
            }
        })

        await prisma.subscriptions.update({
            where: {
                id: sub.id
            },
            data: {
                status: "cancelled"
            }
        })
        
        res.json({status: "ok", "data": {response: ppresp.data}});
    } catch(err) {
        res.status(500).json({status: "error", message: err.response.data});
    }
})


router.get("/get-invoices", checkUser, async (req, res) => {
    const authToken = await getPayPalAuth();
    const user = await prisma.user.findUnique({
        where: {
            authid: req.user.authid
        },
        include: {
            subscription: {
                where: {
                    status: "active"
                }
            }
        }
    })

    if(user.subscription) {
        // get invoice links from paypal
        const s = user.subscription[0];
        let ppresp
        try{
            // 2023 jan first
            const start_time = new Date(1672531200000).toISOString();
            // 1 month from now
            const end_time = new Date(Date.now() + 2629800000).toISOString();
            ppresp = await axios.get(paypalBaseURL + "/v1/billing/subscriptions/" + s.paypalSubscriptionId + "/transactions?start_time=" + start_time + "&end_time=" + end_time, {
                headers: {
                    "Authorization": "Bearer " + authToken,
                    'Content-Type': 'application/json'
                }
            })
        } catch(err) {
            res.status(500).json({status: "error", message: err.response.data});
            return;
        }

        res.json({status: "ok", data: {
            transactions: [...ppresp.data.transactions],
            link: ppresp.data.links.find(link => link.rel == "SELF").href
        }})

    } else {
        res.status(200).json({status: "ok", data: {message: "No active subscription found!"}});
    }
})

async function getPayPalAuth() {
    //create basic authentication token header from client id and secret
    var auth = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');
    var headers = {
        'Accept': '*/*', 
        'Accept-Language': 'en_US',
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': auth
    }

    const resp = await axios.post(paypalBaseURL + "/v1/oauth2/token", "grant_type=client_credentials", {
        headers: headers
    })

    if(resp.status != 200) return false

    return resp.data.access_token;
}


module.exports = router;
