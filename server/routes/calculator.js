const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
const { checkUser } = require('../middleware/checkUser');
var router = express.Router();

router.get('/hedgeStake', checkUser, async function(req, res, next) {
    // calculate the hedge amount for a bet

    // * Check for required querys params and set defaults
    if(!req.query.stake || !req.query.betid){
        res.status(400).json({"error": "Missing required query params"});
        return;
    }

    const betid = parseInt(req.query.betid); // Bet ID
    const stake = parseFloat(req.query.stake); // Total amount in £/$/€ staked

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
    const totalImpliedOdds = betData.total_implied_odds; //e.g 0.983...etc
    let odds = []
    for (var outcome in betData.best_outcome_odds) {
        odds.push({"outcome": outcome, "odds": betData.best_outcome_odds[outcome][1], "book": betData.best_outcome_odds[outcome][0]})
    }

    // * Calculate hedge stake
    odds[0].stake = stake;
    for (var i = 1; i < odds.length; i++) {
        const amount = stake * (odds[0].odds / odds[i].odds);
        odds[i].stake = Math.round((amount + Number.EPSILON) * 100) / 100
    }

    // * Total investment
    let totalInvestment = 0;
    for (let i = 0; i < odds.length; i++) {
        totalInvestment += odds[i].stake;
    }

    // * Calculate profit
    // Profit if outcome A wins: (stake for outcome A x odds for outcome A) – (total investment)
    // Profit if outcome B wins: (stake for outcome B x odds for outcome B) – (total investment)
    // etc..
    for (let i = 0; i < odds.length; i++) {
        var profit = (odds[i].stake * odds[i].odds) - totalInvestment;
        odds[i].profit = Math.round((profit + Number.EPSILON) * 100) / 100;
    }

    res.status(200).json({"status": "ok", "data": {"outcomes": odds}});
});

router.get('/spreadStake', checkUser, async function(req, res, next) {
    // * Check for required querys params and set defaults
    if(!req.query.stake || !req.query.betid){
        res.status(400).json({"error": "Missing required query params"});
        return;
    }

    const betid = parseInt(req.query.betid); // Bet ID
    const stake = parseFloat(req.query.stake); // Total amount in £/$/€ staked

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
    const totalImpliedOdds = betData.total_implied_odds; //e.g 0.983...etc
    let odds = []
    for (var outcome in betData.best_outcome_odds) {
        odds.push({"outcome": outcome, "odds": betData.best_outcome_odds[outcome][1], "book": betData.best_outcome_odds[outcome][0]})
    }

    // * Calculate stakes
    for (var i = 0; i < odds.length; i++) {
        //Individual bets = (Investment x Individual Arbitrage %) / Total Arbitrage %
        const _one_over_odds = 1 / odds[i].odds;
        const amount = (stake * _one_over_odds) / totalImpliedOdds;
        
        odds[i].stake = Math.round((amount + Number.EPSILON) * 100) / 100
    }

    // * Calculate profit
    // Profit = (Investment / Arbitrage %) – Investment
    let profit = (stake / totalImpliedOdds) - stake;
    profit = Math.round((profit + Number.EPSILON) * 100) / 100
    const mathData = {"profit": profit, "outcomes": odds}

    res.status(200).json({"status": "ok", "data": mathData});
});

module.exports = router;
