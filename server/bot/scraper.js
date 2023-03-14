const { getArbitrageOpportunities } = require('./brains.js');

async function returnBettingOpportunities(cutoff) {
    return new Promise((resolve, reject) => {
        // get current time
        const now = new Date();
        const lastUpdated = new Date() - 600001; // ! UPDATE

        // if data is outdated, get new data
        if (now - lastUpdated > 600000) {
            console.log("Data is outdated. Getting new data...");
            getArbitrageOpportunities(cutoff).then((arb_data) => {
                resolve(arb_data);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        } else {
            console.log("Data is up to date. Returning cached data...");
            resolve({"data": "TEST_DATA_1"});
        }
    });
}

module.exports = {returnBettingOpportunities}