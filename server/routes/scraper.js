// import ../bot/scraper.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { returnBettingOpportunities } = require('../bot/scraper.js');
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
let { freeStuff } = require('../middleware/freeStuff');
var router = express.Router();
const axios = require('axios');


router.get('/run', checkUser ,async function(req, res, next) {
    // * Check for required querys params and set defaults
    const cutoff = (req.query.cutoff) ? req.query.cutoff : 0.01; // in percentage

    // * Get most recently updated bet
    const mostRecentBet = await prisma.bet.findFirst({
        orderBy: {
            updatedAt: 'desc'
        },
    })
    const lastUpdated = (mostRecentBet) ? new Date(mostRecentBet.updatedAt) : new Date(0);

    // * Get arbitrage data
    let data
    await returnBettingOpportunities(cutoff, lastUpdated).then((response) => {
        data = response;
    }).catch((error) => {
        res.status(500).json({"error": "Failed to run scraper"});
        return;
    })

    if(!data) {
        res.status(200).json({"status": "ok", "message": "Data already up to date."});
        return;
    }

    // * Insert arbitrage data into database - update records if already exist
    let betsToInsert = [];
    let updatedCount = 0;
    const arbitrageData = data.data.arbitrage;
    let newArbBets = 0
    const evData = data.data.ev;
    let newEVBets = 0

    await prisma.bet.findMany().then(async (existingBets) => {

        // ! Insert/update arbitrage
        for (let i = 0; i < arbitrageData.length; i++) {
            let found = false;

            // If bet already exists - update it
            for (let j = 0; j < existingBets.length; j++) {
                const parsedBetData = JSON.parse(existingBets[j].data);
                if (arbitrageData[i].match_id == parsedBetData.match_id && existingBets[j].type =="arbitrage") {
                    try {
                        await prisma.bet.update({
                            where: {
                                id: existingBets[j].id
                            },
                            data: {
                                data: JSON.stringify(arbitrageData[i]),
                            }
                        })
                    } catch {
                        res.status(500).json({"error": "Failed to update arbitrage data in database."});
                        return;
                    }

                    updatedCount++;
                    found = true;
                    break;
                }
            }

            if(!found){
                newArbBets++;
                betsToInsert.push([JSON.stringify(arbitrageData[i]), "arbitrage"]);
            }
        }

        // ! Insert/update ev
        for (let i = 0; i < evData.length; i++) {
            let found = false;

            // If bet already exists - update it
            for (let j = 0; j < existingBets.length; j++) {
                const parsedBetData = JSON.parse(existingBets[j].data);
                if (evData[i].match_id == parsedBetData.match_id && existingBets[j].type =="ev") {
                    try {
                        await prisma.bet.update({
                            where: {
                                id: existingBets[j].id
                            },
                            data: {
                                data: JSON.stringify(evData[i]),
                            }
                        })
                    } catch {
                        res.status(500).json({"error": "Failed to update arbitrage data in database."});
                        return;
                    }

                    updatedCount++;
                    found = true;
                    break;
                }
            }

            if(!found){
                newEVBets++;
                betsToInsert.push([JSON.stringify(evData[i]), "ev"]);
            }
        }            
    });

    // Insert new bets
    try {
        for(let i = 0; i < betsToInsert.length; i++){
            const toput = betsToInsert[i];
            await prisma.bet.create({
                data: {
                    data: toput[0],
                    type: toput[1]
                }
            })

            var book = [];
            const pjson = JSON.parse(toput[0]);
            toput[1] == "ev" ? 
            book.push(pjson.bookmaker) : 
            Object.keys(pjson.best_outcome_odds).map(key => book.push(pjson.best_outcome_odds[key][0]));
            
            var newBook = []
            for (const x of book) {
                const existingRecords = await prisma.bookmaker.findMany({ 
                    where: {
                        bookName: x 
                    } 
                })
                if (existingRecords.length == 0) {
                    newBook.push(x);
                }
            }
            
            
            // If no record with the same name exists, create a new one with an auto-incremented ID
            for (let p=0; p<newBook.length; p++) {
                const bookieNameToPut = newBook[p];
                await prisma.bookmaker.create({
                    data: {
                        bookName: bookieNameToPut
                    }
                })
                
            }
            
        }
    } catch(e){ 
        console.log(e);
        res.status(500).json({"error": "Failed to create new bet records in database."});
        return;
    }

    res.json({"status": "ok", "data":{
        "new_arb_bets": newArbBets,
        "new_ev_bets": newEVBets,
        "total_new_bets": betsToInsert.length,
        "updated_bets": updatedCount

    }, "Message": `${betsToInsert.length} new bets found. ${updatedCount} bets updated.`});

    // send notifications
    //await sendBatchNotifications();
});

router.post("/clean", async function(req, res, next){
    const threshold = (req.body.threshold) ? parseInt(req.body.threshold) : 10; // in minutes

    // Get all bets that are older than 10 minutes
    const betsToDelete = await prisma.bet.findMany({
        // where: {
        //     updatedAt: {
        //         lt: new Date(Date.now() - (threshold * 60 * 1000))
        //     }
        // }
    })

    // Delete all bets that are older than 10 minutes
    for(let i = 0; i < betsToDelete.length; i++){
        await prisma.bet.delete({
            where: {
                id: betsToDelete[i].id
            }
        })
    }

    res.json({"status": "ok", "Message": `${betsToDelete.length} bets deleted (older than ${threshold} minutes).`});
        
})

router.get("/all", freeStuff, async function(req, res, next){
    const perPage = 25;
    let arbBets = []
    let evBets = []
    // const userWhitelist = JSON.parse(req.user.whitelist);

    if(req.user.plan != "free") {
        // ! get and sort arb bets by lowest implied odds
        arbBets = await prisma.bet.findMany({
            where: {
                type: "arbitrage"
            }
        })
        arbBets.forEach(bet => {
            bet.data = JSON.parse(bet.data);
        });
        arbBets.sort((a, b) => {
            return a.data.total_implied_odds - b.data.total_implied_odds;
        })

        // ! get an sort ev bets by highest %
        evBets = await prisma.bet.findMany({
            where: {
                type: "ev"
            }
        })
        evBets.forEach(bet => {
            bet.data = JSON.parse(bet.data);
        });
        evBets.sort((a, b) => {
            return b.data.ev - a.data.ev;
        })

        // ! League formatting for arb bets
        for(let i = 0; i < arbBets.length; i++){
            // * Add formatted league name to the object
            const leagueFormatted = arbBets[i].data.league.replaceAll("_", " ").split(" ");
            for(let j = 0; j < leagueFormatted.length; j++){
                leagueFormatted[j] = leagueFormatted[j].charAt(0).toUpperCase() + leagueFormatted[j].slice(1);
            }
            arbBets[i].data.leagueFormatted = leagueFormatted.join(" ");
        }

        // ! League formatting for ev bets
        for(let i = 0; i < evBets.length; i++){
            const leagueFormatted = evBets[i].data.league.replaceAll("_", " ").split(" ");
            for(let j = 0; j < leagueFormatted.length; j++){
                leagueFormatted[j] = leagueFormatted[j].charAt(0).toUpperCase() + leagueFormatted[j].slice(1);
            }
            evBets[i].data.leagueFormatted = leagueFormatted.join(" ");
        }
        
    } else {
        arbBets = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
        evBets = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
    }
    res.json({"status": "ok", "data": {
        "arbitrage": arbBets,
        "ev": evBets
    }});
});

router.post("/ev/simulate", async function(req, res, next){
    const {betId, bets} = req.body;
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
            const w = (betAmount * odds) - betAmount;
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
        axios.post("http://localhost:3000/notification/sms", {
            userids: userids_sms,
            betid: noti.id
        }).then((res) => {
                console.log(res);
            }
        ).catch((err) => {
            console.log(err);
        })

        // ! Send BULK EMAIL
        axios.post("http://localhost:3000/notification/email", {
            userids: userids_sms,
            betid: noti.id
        }).then((res) => {
                console.log(res);
            }
        ).catch((err) => {
            console.log(err);
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
