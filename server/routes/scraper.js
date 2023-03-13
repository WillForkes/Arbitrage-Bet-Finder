// import ../bot/scraper.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { returnArbitrageData } = require('../bot/scraper.js');
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();
const axios = require('axios');


/* GET home page. */
router.get('/run', checkUser ,async function(req, res, next) {
    // * Check for required querys params and set defaults

    // variables
    const cutoff = (req.query.cutoff) ? req.query.cutoff : 0.005; // in percentage

    // * Get arbitrage data
    let data
    try {
        data = await returnArbitrageData(cutoff)
    } catch{ 
        res.status(500).json({"error": "Failed to get data."});
        return;
    }

    // * Insert arbitrage data into database - update records if already exist
    let betsToInsert = [];
    let updatedCount = 0;

    await prisma.bet.findMany().then(async (existingBets) => {

        // Loop through all bets scraped
        for (let i = 0; i < data.data.length; i++) {
            let found = false;

            // If bet already exists - update it
            for (let j = 0; j < existingBets.length; j++) {
                const parsedBetData = JSON.parse(existingBets[j].data);
                if (data.data[i].match_id == parsedBetData.match_id) {
                    try {
                        await prisma.bet.update({
                            where: {
                                id: existingBets[j].id
                            },
                            data: {
                                data: JSON.stringify(data.data[i])
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
                betsToInsert.push(JSON.stringify(data.data[i]));
            }
        }
    });

    // Insert new bets
    try {
        for(let i = 0; i < betsToInsert.length; i++){
            const topup = betsToInsert[i];
            await prisma.bet.create({
                data: {
                    data: topup
                }
            })
        }
    } catch{ 
        res.status(500).json({"error": "Failed to create new bet records in database."});
        return;
    }

    res.json({"status": "ok", "Message": `${betsToInsert.length} new bets found. ${updatedCount} bets updated. ${goodBets.length} notifications sent.`});

    // send notifications
    await sendBatchNotifications();
});

router.get("/all", checkUser, async function(req, res, next){
    // get all bets and sort in descending order (by time
    let bets = await prisma.bet.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    })

    // parse the data key for each bet into json
    for(let i = 0; i < bets.length; i++){
        bets[i].data = JSON.parse(bets[i].data);
    }

    res.json({"status": "ok", "data": bets});
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
