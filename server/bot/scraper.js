const { getArbitrageOpportunities, getInplayOpportunities } = require('./brains.js');

async function returnBettingOpportunities(cutoff, lastUpdated) {
    return new Promise((resolve, reject) => {
        // get current time
        const now = new Date();

        // if data is outdated, get new data
        if (now - lastUpdated > 300000 || process.env.NODE_ENV == "development") { // 5 mins
            getArbitrageOpportunities(cutoff).then((arb_data) => {
                resolve(arb_data);
            }).catch((err) => {
                reject(err);
            });
        } else {
            resolve(false);
        }
    });
}

async function updateInplayOpportunities(inplay_data, cutoff, lastUpdated) {
    return new Promise((resolve, reject) => {
        // get current time
        const now = new Date();

        // if data is outdated, get new data
        if (now - lastUpdated > (1000 * 30) || process.env.NODE_ENV == "development") { // 1 min
            getInplayOpportunities(inplay_data, cutoff).then((inplay_data) => {
                resolve(inplay_data);
            }).catch((err) => {
                reject(err);
            });
        } else {
            resolve(false);
        }
    });
}


module.exports = {returnBettingOpportunities, updateInplayOpportunities}