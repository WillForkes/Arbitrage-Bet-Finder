const { getArbitrageOpportunities, getInplayOpportunities } = require('./brains.js');
const { runGenerator, onYield } = require('./lib/generator')

async function returnBettingOpportunities(lastUpdated) {
    // get current time
    const now = new Date();
  
    // if data is outdated, get new data
    if (now - lastUpdated > 300000 || process.env.NODE_ENV == "development") {
        const gao = await getArbitrageOpportunities()

        return gao;
    } else {
        return false;
    }
}

async function updateInplayOpportunities(inplay_data, lastUpdated) {
    // get current time
    const now = new Date();

    // if data is outdated, get new data
    if (now - lastUpdated > (1000 * 30) || process.env.NODE_ENV == "development") { // 1 min
        const gio = await getInplayOpportunities(inplay_data)
        return gio;
    } else {
        return false
    }
}


module.exports = {returnBettingOpportunities, updateInplayOpportunities}