const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient()
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();

//! Caution - Bets can update and change and hence the calculation may not appear right however they are correct as of time of creation
router.post('/new', checkUser ,async function(req, res, next) {
    // * Check for required querys params and set defaults
    if(!req.body.betid || !req.body.stake){
        res.status(400).json({"error": "Missing required query params"});
        return;
    }

    const betid = parseInt(req.body.betid); // Bet ID
    const stake = parseFloat(req.body.stake); // Total amount in £/$/€ staked

    // * Get bet
    const bet = await prisma.bet.findUnique({
        where: {
            id: betid
        }
    })

    if(!bet){
        res.status(404).json({"error": "Bet not found"});
        return;
    }

    const betData = JSON.parse(bet.data);
    let profitPercentage = (1 - betData.total_implied_odds); //e.g 0.035
    // round to 4 decimal places
    profitPercentage = Math.round((profitPercentage + Number.EPSILON) * 10000) / 10000

    // * Create new tracker
    prisma.placedBets.create({
        data: {
            userId: req.user.authid,
            betId: betid,
            totalStake: stake,
            profitPercentage: profitPercentage

        }
    }).then((tracker) => {
        res.status(200).json({"status": "ok", "data": tracker});
    }).catch((err) => {
        res.status(500).json({"error": "Failed to create new tracker.", "details": err});
        console.log(err)
    })
});

router.get('/all', checkUser, async function(req, res, next) {
    // * Get all trackers
    const placedBets = await prisma.placedBets.findMany({
        where: {
            userId: req.user.authid
        },
        include: {
            bet: true
        }
    })

    res.json({"status": "ok", "data": placedBets});

});

module.exports = router;
