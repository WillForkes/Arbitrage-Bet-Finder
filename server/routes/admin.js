const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
const { checkUser } = require('../middleware/checkUser');
const { checkStaff } = require('../middleware/checkStaff');

var router = express.Router();

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



module.exports = router;
