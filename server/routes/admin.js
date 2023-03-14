const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
const { checkUser } = require('../middleware/checkUser');
const { checkStaff } = require('../middleware/checkStaff');

var router = express.Router();

router.post('/signupDeals/create', [checkUser, checkStaff], async function(req, res, next) {
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


module.exports = router;
