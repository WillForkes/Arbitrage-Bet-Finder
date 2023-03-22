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

    // variables
    const cutoff = (req.query.cutoff) ? req.query.cutoff : 0.01; // in percentage

    // * Get arbitrage data
    let data
    try {
        data = await returnBettingOpportunities(cutoff)
    } catch(err) { 
        res.status(500).json({"error": "Failed to get data: " + err});
        return;
    }

    // * Insert arbitrage data into database - update records if already exist
    let betsToInsert = [];
    let updatedCount = 0;
    const arbitrageData = data.data.arbitrage;
    const evData = data.data.ev;

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
        }
    } catch{ 
        res.status(500).json({"error": "Failed to create new bet records in database."});
        return;
    }

    res.json({"status": "ok", "Message": `${betsToInsert.length} new bets found. ${updatedCount} bets updated.`});

    // send notifications
    //await sendBatchNotifications();
});

router.post("/clean", async function(req, res, next){
    const threshold = (req.body.threshold) ? parseInt(req.body.threshold) : 10; // in minutes

    // Get all bets that are older than 10 minutes
    const betsToDelete = await prisma.bet.findMany({
        where: {
            updatedAt: {
                lt: new Date(Date.now() - (threshold * 60 * 1000))
            }
        }
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
    const page = (req.query.page) ? parseInt(req.query.page) - 1 : 0;
    const perPage = 25;
    const skip = page * perPage;
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

        // Paginate - into 25 bets per page
        arbBets = arbBets.slice(skip, skip + perPage);
        evBets = evBets.slice(skip, skip + perPage);

        // ! League formatting for arb bets
        for(let i = 0; i < arbBets.length; i++){
            // * Check to see if all bookmakers in bet are whitelisted on user account
            // * If not, remove bet from array
            // if(userWhitelist.length > 2) { // ! Must have ATLEAST 2 bookmakers whitelisted
            //     if(arbBets[i].type == "arbitrage"){
            //         arbBets[i].data.best_outcome_odds.forEach(bookmakerArray => {
            //             if(!userWhitelist.includes(bookmakerArray[0].toLowerCase()))
            //                 arbBets.splice(i, 1)
            //         }); 
            //     }
            // }


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


async function sendBatchNotifications(){
    // Get all users with sms notifications enabled
    const usersWithSMSNoti = await prisma.user.findMany({
        where: {
            smsNotifications: true
        }
    })

    // Get all users with email notifications enabled
    const usersWithEmailNoti = await prisma.user.findMany({
        where: {
            emailNotifications: true
        }
    })

    // Scan through all bets ordered by updated at in descending order
    let betsToScan = await prisma.bet.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    })


    // For each bet, check if the % profit is greater than 3% and send sms/email to users
    let goodBets = [];
    for(let i = 0; i < betsToScan.length; i++){
        const bet = betsToScan[i];
        const parsedBetData = JSON.parse(bet.data);

        if((1 - parsedBetData.total_implied_odds) > 0.05) {
            goodBets.push(bet);
        }
    }
    goodBets.sort((a, b) => {
        return (1 - JSON.parse(a.data).total_implied_odds) - (1 - JSON.parse(b.data).total_implied_odds);
    })
    goodBets = goodBets.slice(0, 3);


    // Send sms/email to users
    for(let i = 0; i < goodBets.length; i++){
        const bet = goodBets[i];
        const parsedBetData = JSON.parse(bet.data);

        // Send sms to users with sms notifications enabled
        for(let j = 0; j < usersWithSMSNoti.length; j++){
            const user = usersWithSMSNoti[j];
            console.log("Sending sms notification to " + user.authid)
            // post request to /notification/sms
            await axios.post('http://localhost:3000/notification/sms', {
                "authid": user.authid,
                "betid": bet.id
            })
        }

        // Send email to users with email notifications enabled
        for(let j = 0; j < usersWithEmailNoti.length; j++){
            const user = usersWithEmailNoti[j];
            console.log("Sending email notification to " + user.authid)
            // post request to /notification/email
            await axios.post('http://localhost:3000/notification/email', {
                "authid": user.authid,
                "betid": bet.id
            })
        }
    }

    return true;
}

module.exports = router;