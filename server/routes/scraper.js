// import ../bot/scraper.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { returnArbitrageData } = require('../bot/scraper.js');
var express = require('express');
let { checkUser } = require('../middleware/checkUser');
var router = express.Router();


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


    res.json({"status": "ok", "Message": `${betsToInsert.length} new bets found. ${updatedCount} bets updated.`});
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

module.exports = router;
