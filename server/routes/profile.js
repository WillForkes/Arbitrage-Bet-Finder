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

module.exports = router;
