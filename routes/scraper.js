// import ../bot/scraper.js
const { getArbitrageData } = require('../bot/scraper.js');

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {
    // required querys params: sport, apikey
    // check for required paramets
    if (!req.query.sport || !req.query.apikey) {
        res.status(400).json({"error": "Missing required parameters"});
        return;
    }

    // variables
    const validRegions = ['eu', 'uk', 'au', 'us'];
    const validCurrencies = ['EUR', 'GBP', 'AUD', 'USD']
    const currency = (req.query.currency) ? req.query.currency.toUpperCase() : "USD";
    const cutoff = (req.query.cutoff) ? req.query.cutoff : 1; // in percentage
    const region = (req.query.region) ? req.query.region.toLowerCase() : "us";
    const sport = req.query.sport
    const apikey = req.query.apikey

    // check for valid region
    if (!validRegions.includes(region) || validCurrencies.includes(currency)) {
        res.status(400).json({"error": "Invalid parameters provided. Please check your parameters and try again."});
        return;
    }

    console.log({
        "region": region,
        "sport": sport,
        "currency": currency,
        "cutoff": cutoff,
        "apikey": apikey
    })

    getArbitrageData().then((data) => {
        res.json(data);
    });
});

module.exports = router;
