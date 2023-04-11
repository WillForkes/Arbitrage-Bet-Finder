const { getArbitrageOpportunities } = require('./brains.js');

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

module.exports = {returnBettingOpportunities}