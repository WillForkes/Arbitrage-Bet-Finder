const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient()
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();

// * Update whitelisted bookies
router.post('/whitelist', checkUser, async function(req, res, next) {
    // update bookmaker whitelist on user profile
    const add = req.body.add; // array
    
    let currentWhitelist = JSON.parse(req.user.whitelist)
    let newWhitelist = currentWhitelist.concat(add)

    // remove duplicates
    newWhitelist = [...new Set(newWhitelist)]

    await prisma.user.update({
        where: {
            authid: req.user.authid
        },
        data: {
            whitelist: JSON.stringify(newWhitelist)
        }
    })
    
    res.status(200).json({"status": "ok", "data": {
        "whitelist": newWhitelist
    }})
});

// * Get whitelisted bookies
router.get('/whitelist', checkUser, async function(req, res, next) {
    // get bookmaker whitelist on user profile
    const whitelist = JSON.parse(req.user.whitelist)
    res.status(200).json({
        "status": "ok", 
        "data": {
            "whitelist": whitelist
        }
    })
});

// * Update all profile
router.post('/update', checkUser, async function(req, res, next) {
    let { region, phone, email, smsNotifications, emailNotifications } = req.body;
    region = (region) ? region : req.user.region;
    phone = (phone) ? phone : req.user.phone;
    email = (email) ? email : req.user.email;
    smsNotifications = (smsNotifications) ? smsNotifications : req.user.smsNotifications;
    emailNotifications = (emailNotifications) ? emailNotifications : req.user.emailNotifications;

    const updateData = {
        region: region,
        phone: phone,
        email: email,
        smsNotifications: smsNotifications,
        emailNotifications: emailNotifications
    }
    console.log(updateData);

    const updatedUser = await prisma.user.update({
        where: {
            authid: req.user.authid
        },
        data: updateData
    })

    if(!updatedUser){
        res.status(500).json({"error": "Error updating user"})
        return;
    }

    res.status(200).json({"status": "ok", "data": updatedUser})
});

// * Get profile data
router.get('/', checkUser, async (req, res) => {
    let dbuser = await prisma.user.findUnique({
        where: {
            authid: req.oidc.user.sub
        }
    })

    if(!dbuser){
        res.status(500).json({"error": "Error getting user"})
        return;
    }

    dbuser.plan = req.user.plan
    dbuser.planExpiresAt = req.user.planExpiresAt
    
    res.json({
        "status":"ok",
        "data": {
            "auth0": req.oidc.user,
            "dbuser": dbuser
        }});
});

router.get("/invoices", checkUser, async function(req, res, next) {
    const invoices = await prisma.invoice.findMany({
        include: {
            subscription: true
        }
    })

    //search through subscriptions to find matching user id and append to array
    let invoicesReal = []
    for(let i = 0; i < invoices.length; i++){
        if(invoices[i].subscription.userId == req.user.authid){
            invoicesReal.push(invoices[i])
        }
    }

    if(!invoices){
        res.status(500).json({"error": "Error getting invoices"})
        return;
    }

    res.status(200).json({"status": "ok", "data": {
        "invoices": invoicesReal
    }})
})

router.post("/startTrial", checkUser, async function(req, res, next) {
    if(req.user.trialActivated == true){
        res.status(401).json({"error": "Trial already activated"})
        return;
    }

    // check user doesnt have any other subs
    const userSubs = await prisma.subscription.count({
        where: {
            userId: req.user.authid,
            status: "active"
        }
    })

    if(userSubs > 0){
        res.status(401).json({"error": "User already has an active subscription"})
        return;
    }

    const sub = await prisma.subscription.create({
        data: {
            userId: req.user.authid,
            plan: "trial",
            planExpiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 5), // 5 days
            status: "active",
        }
    })

    await prisma.user.update({
        where: {
            authid: req.user.authid
        },
        data: {
            trialActivated: true
        }
    })

    if(!sub){
        res.status(500).json({"error": "Error starting trial"})
        return;
    }

    res.status(200).json({"status": "ok", "data": {}})
});


module.exports = router;
