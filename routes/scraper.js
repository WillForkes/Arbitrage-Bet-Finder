// import ../bot/scraper.js
const { returnArbitrageData } = require('../bot/scraper.js');

var express = require('express');
var router = express.Router();
let { checkUser } = require('../middleware/checkUser');

/* GET home page. */
router.get('/', checkUser ,async function(req, res, next) {
    // required querys params: sport
    // check for required paramets
    if (!req.query.region) {
        res.status(400).json({"error": "Missing required parameters"});
        return;
    }

    // variables
    const validRegions = ['eu', 'uk', 'au', 'us'];
    const cutoff = (req.query.cutoff) ? req.query.cutoff : 0.005; // in percentage
    const region = (req.query.region) ? req.query.region.toLowerCase() : "uk";


    // check for valid region
    if (!validRegions.includes(region)) {
        res.status(400).json({"error": "Invalid region parameters provided. Please check your parameters and try again."});
        return;
    }

    returnArbitrageData(region, cutoff).then((data) => {
        res.json(data);
    });
});

module.exports = router;
