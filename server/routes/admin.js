const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
const { checkUser } = require('../middleware/checkUser');
const { checkStaff } = require('../middleware/checkStaff');
const axios = require('axios');

var router = express.Router();
const clientId = (process.env.NODE_ENV == "development") ? process.env.PAYPAL_CLIENT_ID_SANDBOX : process.env.PAYPAL_CLIENT_ID_LIVE;
const clientSecret = (process.env.NODE_ENV == "development") ? process.env.PAYPAL_SECRET_SANDBOX : process.env.PAYPAL_SECRET_LIVE;
const paypalBaseURL = (process.env.NODE_ENV == "development") ? "https://api-m.sandbox.paypal.com" : "https://api.paypal.com";

router.post("/signupDeals/create", [checkUser, checkStaff], async function(req, res, next) {
    const { deal, link, expiresAt } = req.body;
    const user = req.user;

    if(!deal || !link || !expiresAt){
        res.status(400).json({"error": "Missing required fields: [deal, link, expiresAt]"});
        return;
    }

    const dealObj = await prisma.signupDeal.create({
        data: {
            deal: deal,
            link: link,
            expiresAt: expiresAt,
        }
    })

    res.status(200).json({"status": "ok", "data": {"deal": dealObj}});
});

router.post("/user/ban", [checkUser, checkStaff], async function(req, res, next) {
    const { authid } = req.body;

    if(!authid){
        res.status(400).json({"error": "Missing required fields: [authid]"});
        return;
    }

    const user = await prisma.user.update({
        where: {
            authid: authid
        },
        data: {
            banned: true
        }
    })

    if(!user){
        res.status(500).json({"error": "User not found"});
        return;
    }

    res.status(200).json({"status": "ok", "data": {}});
});

router.post("/user/unban", [checkUser, checkStaff], async function(req, res, next) {
    const { authid } = req.body;

    if(!authid){
        res.status(400).json({"error": "Missing required fields: [authid]"});
        return;
    }

    const user = await prisma.user.update({
        where: {
            authid: authid
        },
        data: {
            banned: false
        }
    })
})

router.post("/user/makeStaff", [checkUser, checkStaff], async function(req, res, next) {
    const { authid } = req.body;

    if(!authid){
        res.status(400).json({"error": "Missing required fields: [authid]"});
        return;
    }

    const user = await prisma.user.update({
        where: {
            authid: authid
        },
        data: {
            staff: true
        }
    })
})

router.post("/user/removeStaff", [checkUser, checkStaff], async function(req, res, next) {
    const { authid } = req.body;

    if(!authid){
        res.status(400).json({"error": "Missing required fields: [authid]"});
        return;
    }

    const user = await prisma.user.update({
        where: {
            authid: authid
        },
        data: {
            staff: false
        }
    })
})

router.post("/user/extendSubscription", [checkUser, checkStaff], async function(req, res, next) {
    const { subid, days} = req.body;

    if(!authid || !days){
        res.status(400).json({"error": "Missing required fields: [subid, days]"});
        return;
    }


    const userSubscription = await prisma.subscription.findUnique({
        where: {
            id: subid
        }
    })

    const currentExpirey = new Date(userSubscription.expiresAt);
    const newExpirey = new Date(currentExpirey.getTime() + (days * 24 * 60 * 60 * 1000));

    const newSubscription = await prisma.subscription.update({
        where: {
            id: userSubscription.id
        },
        data: {
            expiresAt: newExpirey
        }
    })

    res.status(200).json({"status": "ok", "data": {"subscription": newSubscription}});
})

router.get("/user/allUsers", [checkUser, checkStaff], async function(req, res, next) {
    try {
        const users = await prisma.user.findMany({include: {subscription: true},
            orderBy: {
            subscription: {
              some: {}
            }
          },
          orderBy: {
            createdAt: 'desc'
          }})
        const totalBetsPlaced = await prisma.placedBets.count();
        const totalBets = await prisma.bet.count({
            
        });
        res.status(200).json({"status": "ok", "data": {"users": users, totalBets: totalBets, totalBetsPlaced: totalBetsPlaced}});
    } catch(e) {
        res.status(400).json({"status": "error", "error":e});
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

router.post("/cancel-subscription/:id", [checkUser, checkStaff], async (req, res) => {
    const authToken = await getPayPalAuth();

    // get subid
    const u = await prisma.user.findFirst({
        where: {
            authid: req.params.id
        },
        include: {
            subscription: {
                where: {
                    status: "active"
                }
            }
        }
    })

    const sub = u.subscription[0];

    if(u.subscription.length == 0) {
        res.status(400).json({status: "error", error: "No active subscription found."});
        return;
    }

    

    try {
        const ppresp = await axios.post(paypalBaseURL + "/v1/billing/subscriptions/" + sub.paypalSubscriptionId + "/cancel", {"reason": "Unknown reason."}, {
            headers: {
                "Authorization": "Bearer " + authToken,
                'Content-Type': 'application/json'
            }
        })
        
        res.json({status: "ok", "data": {response: ppresp.data}});
    } catch(err) {
        res.status(500).json({status: "error", message: err?.response?.data});
    }
})


router.get("/user/:id", [checkUser, checkStaff], async function(req, res, next) {
    try {
        const user = await prisma.user.findUnique({where: {authid: req.params.id}, include: {subscription: true, placedBets: true, }})
        res.status(200).json({"status": "ok", "data": {"user": user}});
    } catch(e) {
        res.status(400).json({"status": "error", "error":e});
    }
})

router.get("/user/allSubs", [checkUser, checkStaff], async function(req, res, next) {
    try {
        const subscriptions = await prisma.subscription.findMany()
        res.json({"status": "ok", "data": {"subscriptions": subscriptions}})
    } catch(e) {
        res.status(400).json({"status": "error", "error":e});
    }
})


module.exports = router;
