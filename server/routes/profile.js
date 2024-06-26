const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient()
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();
const Stripe = require('stripe');

let stripe;
if(process.env.NODE_ENV == 'development') {
    stripe = Stripe(process.env.STRIPE_TEST_SECRET);
} else {
    stripe = Stripe(process.env.STRIPE_LIVE_SECRET);
}


// * Update whitelisted bookies
router.post('/whitelist', checkUser, async function(req, res, next) {
    // update bookmaker whitelist on user profile

    if(req.body.add.length == 0) {
        await prisma.user.update({
            where: {
                authid: req.user.authid
            },
            data: {
                whitelist: "[]"
            }
        })
        res.status(200).json({"status": "ok", "data": {
            "whitelist": []
        }})
        return;
    } else {
        newWhitelist = [...new Set(req.body.add)]
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
    }

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
        },
        include: {
            subscription: true
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


module.exports = router;
