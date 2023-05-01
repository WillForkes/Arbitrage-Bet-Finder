// import ../bot/scraper.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { returnBettingOpportunities, updateInplayOpportunities } = require('../bot/scraper.js');
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
let { freeStuff } = require('../middleware/freeStuff');
var router = express.Router();
const axios = require('axios');
const { runGenerator } = require('../bot/lib/processData');


router.post("/new", async function(req, res, next) {
    const { data } = req.body;
    if(!data) {
        res.status(500).json({"status": "error", "message": "No data supplied"});
        return;
    }

    // * Insert arbitrage data into database - update records if already exist
    let betid = null;
    let found = false;

    await prisma.bet.findMany().then(async (existingBets) => {
        // If bet already exists - update it
        for (let j = 0; j < existingBets.length; j++) {
            const parsedBetData = JSON.parse(existingBets[j].data);
            if (data.match_id == parsedBetData.match_id) {
                try {
                    await prisma.bet.update({
                        where: {
                            id: existingBets[j].id
                        },
                        data: {
                            data: JSON.stringify(data),
                        }
                    })
                    betid = existingBets[j].id;
                } catch {
                    continue
                }

                found = true;

                res.json({"status": "ok", "message": "Bet updated", "betid": betid});
                return;
            }
        }
    });

    // If bet doesn't exist - insert it
    if (!found) {
        try {
            const newBet = await prisma.bet.create({
                data: {
                    data: JSON.stringify(data),
                }
            })

            res.json({"status": "ok", "message": "New bet inserted", "betid":newBet.id});
            return;
        } catch {
            res.status(500).json({"status": "error", "message": "Error inserting new bet"});
            return;
        }
    }
});


router.get("/run", async function(req, res, next) {
    // * Get most recently updated bet
    const mostRecentBet = await prisma.bet.findFirst({
        orderBy: {
            updatedAt: 'desc'
        },
    })
    const lastUpdated = (mostRecentBet) ? new Date(mostRecentBet.updatedAt) : new Date(0);

    // * Get arbitrage data
    let scrapeResult
    try {
        scrapeResult = await returnBettingOpportunities(lastUpdated);
    } catch(error) {
        console.log("[SCRAPER] Failed to run scraper. Error: " + error)
        res.json({"status": "error", "message": "Failed to run scraper. See error logs for more details."});
    }

    if(!scrapeResult){
        res.status(200).json({"status": "ok", "message": "Data already up to date."});
        return;
    }

    // * Clean old bets
    await clean();

    // * Send notifications
    if(process.env.NODE_ENV != "development") {
        const notisToSend = await getNotifications();
        await sendBatchNotifications(notisToSend);
    }

    console.log("[SCRAPER] Scraper run completed.")

    res.json({"status": "ok", "message": "Scraper run completed."});
});

router.get("/run/inplay", async function(req, res) {
    let inplay = await prisma.bet.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    inplay = inplay.filter(x => JSON.parse(x.data).live == true)

    // * Get most recent bet
    const mostRecentBet = inplay[0];
    const lastUpdated = (mostRecentBet) ? new Date(mostRecentBet.updatedAt) : new Date(0);

    // * Run scraper
    let scrapeResult
    try {
        scrapeResult = await updateInplayOpportunities(inplay, lastUpdated);
    } catch{
        res.json({"status": "error", "message": "Failed to run scraper. See error logs for more details."});
    }

    if(!scrapeResult){
        res.status(200).json({"status": "ok", "message": "Data already up to date."});
        return;
    }

    await clean(inplay=true);

    res.json({"status": "ok", "message": "In-play scraper run completed."});
})

router.get("/bookmakers", async function(req, res) {
    try {
        var bookmakers = await prisma.bookmaker.findMany()
        res.json({"status": "ok", data: bookmakers});
    } catch(e) {
        res.status(500).json({"error": "Failed to get bookmakers from database."});
    }
})

async function clean(inplay=false) {
    const threshold = (inplay) ? 2 : 10; // in minutes

    // Get all bets that are older than 2/10 minutes
    const betsToDelete = await prisma.bet.findMany({
        where: {
            updatedAt: {
                lt: new Date(Date.now() - (threshold * 60 * 1000))
            }
        }
    })

    // Delete all bets that are older than 10 minutes
    for(let i = 0; i < betsToDelete.length; i++){

        if(inplay) {
            if(JSON.parse(betsToDelete[i].data).live == true) {
                await prisma.bet.delete({
                    where: {
                        id: betsToDelete[i].id
                    }
                })
            }
        } else {
            await prisma.bet.delete({
                where: {
                    id: betsToDelete[i].id
                }
            })
        }
        
    }

    console.log(`[CLEANER] ${betsToDelete.length} bets deleted (older than ${threshold} minutes).`)
}

router.get("/all", freeStuff, async function(req, res, next){
    let arbBets = []
    let evBets = []
    const userWhitelist = JSON.parse(req.user.whitelist);
    const betType = req.query.type; // * "arbitrage" or "ev"

    if(!betType){
        res.status(400).json({"error": "Missing bet type."});
        return;
    }

    if(req.user.plan == "free" && req.user.staff == false) {
        res.json({"status": "ok", "data": {
            "arbitrage": [{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10}],
            "ev": [{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10}]
        }});
        return
    }

    // ! get and sort arb bets by lowest implied odds
    if(betType == "arbitrage"){
        arbBets = await prisma.bet.findMany({ where: {type: "arbitrage"}})
        arbBets.forEach(bet => { bet.data = JSON.parse(bet.data); });
        arbBets.sort((a, b) => {return a.data.total_implied_odds - b.data.total_implied_odds;})

        if(userWhitelist.length > 0){
            // ! Sort through arb bets, if bookmaker is not in whitelist, remove it
            arbBets = arbBets.filter(bet => {
                const bestOutcomeOdds = bet.data.best_outcome_odds;
                const bestOutcomeOddsKeys = Object.keys(bestOutcomeOdds);
                
                for(let i = 0; i < bestOutcomeOddsKeys.length; i++){
                    const key = bestOutcomeOddsKeys[i];
                    const bookmaker = bestOutcomeOdds[key][0];
                    if(!userWhitelist.includes(bookmaker)){
                        return false;
                    }
                }
                return true;
            })
        }

        // ! League formatting for arb bets
        for(let i = 0; i < arbBets.length; i++){
            // * Add formatted league name to the object
            // replace all _ with spaces, then capitalize first letter of each word
            const leagueFormatted = arbBets[i].data.league.replace(/_/g, " ").split(" ");
            for(let j = 0; j < leagueFormatted.length; j++){
                leagueFormatted[j] = leagueFormatted[j].charAt(0).toUpperCase() + leagueFormatted[j].slice(1);
            }
            arbBets[i].data.leagueFormatted = leagueFormatted.join(" ");
        }
    }

    if(betType == "ev") {
        // ! get an sort ev bets by highest %
        evBets = await prisma.bet.findMany({ where: { type: "ev" } })
        evBets.forEach(bet => { bet.data = JSON.parse(bet.data); });
        evBets.sort((a, b) => { return b.data.ev - a.data.ev; })

        if(userWhitelist.length > 0){
            // ! Sort through ev bets, if bookmaker is not in whitelist, remove it
            evBets = evBets.filter(bet => {
                const bookmaker = bet.data.bookmaker;
                if(!userWhitelist.includes(bookmaker)){
                    return false;
                }
                return true;
            })
        }

        // ! League formatting for ev bets
        for(let i = 0; i < evBets.length; i++){
            const leagueFormatted = evBets[i].data.league.replace(/_/g, " ").split(" ");
            for(let j = 0; j < leagueFormatted.length; j++){
                leagueFormatted[j] = leagueFormatted[j].charAt(0).toUpperCase() + leagueFormatted[j].slice(1);
            }
            evBets[i].data.leagueFormatted = leagueFormatted.join(" ");
        }
    }

    // filter through arb bets, if user plan is not "plus" then remove bets with total implied odds <0.9
    arbBets = arbBets.filter(bet => {
        if(req.user.plan == "pro" || req.user.plan == "plus" || req.user.staff){
            return true;
        }
        const _pg = ((1 / bet.data.total_implied_odds) - 1).toFixed(2) // percentage gain | 0.1 = 10%
        if(_pg <= 0.1){
            return true;
        }
        return false;
    })

        
    res.json({"status": "ok", "data": {
        "arbitrage": arbBets,
        "ev": evBets
    }});
});

router.get("/bet/:id", checkUser, async function(req, res, next){
    const betId = parseInt(req.params.id);

    if(req.user.plan == "free" && req.user.staff == false) {
        res.status(400).json({"error": "You need to upgrade to a paid plan to view this page."});
        return;
    }
    
    if(!betId || isNaN(betId)){
        res.status(400).json({"error": "Missing bet ID."});
        return;
    }

    const bet = await prisma.bet.findUnique({
        where: {
            id: betId
        }
    })

    res.json({"status": "ok", "data": {"bet":bet}});
})

router.post("/ev/simulate", async function(req, res, next){
    let {betId, bets} = req.body;

    if(!betId) {
        res.status(400).json({"error": "Missing bet ID."});
        return;
    }
    if(!bets) {
        bets = 100000;
    }

    const bet = await prisma.bet.findUnique({      
        where: {
            id: betId
        }
    })

    const betdata = JSON.parse(bet.data);

    const simRes = simulateBet(bets, betdata);

    res.json({"status": "ok", "data": simRes});

})

function simulateBet(n, data) {
    // * calculate kelly multiplier
    // get odds
    const odds = data.odds;
    const noVigOdds = data.noVigOdds; // without bookie fee (vigorish)

    let betsWon = 0;
    let betsLost = 0;
    let amountWon = 0;
    let amountLost = 0;
    let totalBet = 0;
    let roiPercent = 0;

    for(let i=0; i < n; i++){
        const kmul = calculateKellyMultiplier(data.winProbability, odds - 1);
        const betAmount = 1 * kmul;
        const betResult = Math.random() <= data.winProbability ? "win" : "lose";
        totalBet += betAmount;

        if(betResult == "win"){
            let w = (betAmount * odds) - betAmount;
            betsWon++;
            amountWon += w;
        } else {
            const l = betAmount;
            betsLost++;
            amountLost += l;
        }
    }

    amountWon = amountWon.toFixed(2);
    amountLost = amountLost.toFixed(2);
    const netGain = amountWon - amountLost;
    roiPercent = ((netGain / totalBet) * 100).toFixed(2);

    return {
        "betData": data,
        "simulatedBets": n,
        "betsWon": betsWon,
        "betsLost": betsLost,
        "roiPercent": roiPercent + "%"
    }

}

function calculateKellyMultiplier(winProb, netOdds) {
    // kelly multiplier =  (win prob * net odds of bet) - (lose prob) / net odds of bet
    const loseProb = 1 - winProb;
    const kmultiplier = ((netOdds * winProb) - loseProb) / netOdds;
    return kmultiplier;
}

async function getNotifications(){
    // Get all users with sms notifications enabled
    const usersWithNoti = await prisma.user.findMany({
        where: {
            OR: [
                {
                    smsNotifications: true
                },
                {
                    emailNotifications: true
                }
            ]
        }
    })

    // Scan through all bets ordered by updated at in descending order
    let betsToScan = await prisma.bet.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    })

    // For each bet, check if the % profit is greater than 3% and send sms/email to users
    let topArbBets = [];
    let topEvBets = [];

    for(let i = 0; i < betsToScan.length; i++){
        const bet = betsToScan[i];
        const parsedBetData = JSON.parse(bet.data);

        if(bet.type == "ev") {
            if((1 - parsedBetData.ev) > 0.10) { //! change to user set threshold
                topEvBets.push(bet);
            }
        } else {
            if((1 - parsedBetData.total_implied_odds) > 0.04) {
                topArbBets.push(bet);
            }
        }
        
    }
    topArbBets.sort((a, b) => {
        return (1 - JSON.parse(a.data).total_implied_odds) - (1 - JSON.parse(b.data).total_implied_odds);
    })
    topEvBets.sort((a, b) => {
        return JSON.parse(a.data).ev - JSON.parse(b.data).ev;
    })
    
    // Top 2 arb and ev bets
    topArbBets = topArbBets.slice(0, 1);
    topEvBets = topEvBets.slice(0, 1);
    topBets = topArbBets.concat(topEvBets);

    // For each user, check if their whitelisted bookmakers are in the top 10 arb and ev bets
    for(let i = 0; i < usersWithNoti.length; i++){
        const user = usersWithNoti[i];
        const userWhitelist = JSON.parse(user.whitelist);

        // iterate over all bets
        for(let j = 0; j < topBets.length; j++){
            let bet = topBets[j];
            bet.sendTo=[];
            let arbWhitelistedmatchedBookmakers = 0

            // with each bet, iterate over all bookmakers in the users whitelist and check if they are in the bet
            for(let k = 0; k < userWhitelist.length; k++){
                
                // ! For ev bets, theres only one bookmaker
                if(bet.type == "ev") {
                    if(bet.data.includes(userWhitelist[k])){
                        topBets[j].sendTo.push({user: user.authid, type: "ev", sms: user.smsNotifications, email: user.emailNotifications})                        
                    }
                } else { // ! For arb bets, there are multiple bookmakers
                    if(bet.data.includes(userWhitelist[k])){
                        arbWhitelistedmatchedBookmakers++;
                    }
                    
                    if(arbWhitelistedmatchedBookmakers >= 2) {
                        topBets[j].sendTo.push({user: user.authid, type: "ev", sms: user.smsNotifications, email: user.emailNotifications})                        
                    }
                }
            }
        }
    }

    // sort through all notifications and remove duplicates
    return topBets;
}

async function sendBatchNotifications(notifications) {
    notifications.forEach(noti => {
        const sendTo = noti.sendTo;

        if(sendTo == undefined || sendTo.length == 0) {
            return;
        }

        // generate lists of user ids for this notification to be sent to
        let userids_sms = sendTo.map(o => {
            if (o.sms == true) {
                return o.user
            }
        });
        let userids_email = sendTo.map(o => {
            if(o.email == true){
                return o.user
            }
        });
        userids_sms = userids_sms.filter(item => item);
        userids_email = userids_email.filter(item => item);

        // ! Send BULK SMS
        axios.post(process.env.BASEURL + "/notification/sms", {
            userids: userids_sms,
            betid: noti.id
        }).then((res) => {
            console.log("Sent sms notifications!");
        }
        ).catch((err) => {
            console.log("Error sending sms notifications: " + err);
        })

        // ! Send BULK EMAIL
        axios.post(process.env.BASEURL + "/notification/email", {
            userids: userids_email,
            betid: noti.id
        }).then((res) => {
                console.log("Sent email notifications!");
            }
        ).catch((err) => {
            console.log("Error sending email notifications: " + err);
        })

        
    });
}

// getNotifications().then((res) => {
//     console.log(res);
//     sendBatchNotifications(res).then((res) => {
//         console.log("Done!");
//     })
// })



module.exports = router;
