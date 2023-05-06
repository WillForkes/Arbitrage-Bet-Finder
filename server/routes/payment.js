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
        starter_trial: "P-1U892179YC897811XMRLJNZQ",
        pro: "P-9GY62972LS0576048MRJ5WSA",
        pro_trial: "P-94M92089Y3220752VMRLJNKY"
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
            "return_url": (process.env.NODE_ENV == "development") ? "http://localhost:3000/payment/complete" : "https://api.arbster.com/payment/complete",
            "cancel_url": (process.env.NODE_ENV == "development") ? "http://localhost:3001/profile" : "https://arbster.com/profile"
        }
    };

    try{
        const ppresp = await axios.post(paypalBaseURL + "/v1/billing/subscriptions", billingAgreementAttributes, {
            headers: {
                "Authorization": "Bearer " + authToken
            },
        
        })

        res.json({ status: "ok", data: ppresp.data});
    } catch(err) {
        res.json({status: "error", message: err.response});
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

router.get("/complete", checkUser, async (req, res) => {
    try {
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
    
        await prisma.subscription.create({
            data: {
                paypalSubscriptionId: subId,
                planExpiresAt: expiresAt,
                status: status,
                userId: req.user.authid,
                plan: planName
            }
        })
        res.redirect((process.env.NODE_ENV == "development") ? "http://localhost:3001/subscription/success" : "https://arbster.com/subscription/success")
    } catch(e) {
        res.redirect((process.env.NODE_ENV == "development") ? "http://localhost:3000/payment/create" : "https://api.arbster.com/payment/create")
    }
})

router.post("/cancel-subscription", checkUser, async (req, res) => {
    console.log(req)
    const authToken = await getPayPalAuth();

    // get subid
    const sub = await prisma.subscriptions.findMany({
        where: {
            userId: req.user.id
        }
    })

    try {
        const ppresp = await axios.get(paypalBaseURL + "/v1/billing/subscriptions/" + sub.paypalSubscriptionId + "/cancel", {
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
    const subscription = await prisma.user.findUnique({
        where: {
            authid: req.user.authid
        },
        select: {
            subscription: true
        }
    })

    if (subscription.subscription.length == 0) {
        res.json({status: "ok", data: []})
        return;
    }
    const urisuf = "/v1/billing/subscriptions/" + subscription.paypalSubscriptionId + `/transactions?start_time=${new Date(1683394957 *1000).toISOString()}&end_time=${(new Date()).toISOString()}`
    try {
        const ppresp = await axios.get(paypalBaseURL + urisuf, {
            headers: {
                "Authorization": "Bearer " + authToken,
                'Content-Type': 'application/json'
            }
        })
        res.json({status: "ok", data: ppresp.transactions})
    } catch(e) {
        res.status(500).json({status: "error", message: e.response.data});
    }

   
})

router.post("/webhook", async (req, res) => {
    const event_type = req.body.event_type;
    const data = req.body.resource;
    const subId = data.id;

    switch(event_type) {
        case "BILLING.SUBSCRIPTION.UPDATED":
            // * Update the user's subscription status
            const nextExpirey = new Date(data.billing_info.next_billing_time);
            const status = data.status.toLowerCase();

            await prisma.subscription.update({
                where: {
                    paypalSubscriptionId: subId
                },
                data: {
                    planExpiresAt: nextExpirey,
                    status: status
                }
            })

        case "BILLING.SUBSCRIPTION.CANCELLED":
            // * Update the user's subscription status            
            await prisma.subscription.update({
                where: {
                    paypalSubscriptionId: subId
                },
                data: {
                    status: "cancelled"
                }
            })

        case "BILLING.SUBSCRIPTION.EXPIRED":
            // * Update the user's subscription status            
            await prisma.subscription.update({
                where: {
                    paypalSubscriptionId: subId
                },
                data: {
                    status: "expired"
                }
            })

        case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
            // * Update the user's subscription status            
            await prisma.subscription.update({
                where: {
                    paypalSubscriptionId: subId
                },
                data: {
                    status: "payment_failed"
                }
            })

        case "BILLING.SUBSCRIPTION.SUSPENDED":
            // * Update the user's subscription status            
            await prisma.subscription.update({
                where: {
                    paypalSubscriptionId: subId
                },
                data: {
                    status: "payment_failed"
                }
            })
            
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
