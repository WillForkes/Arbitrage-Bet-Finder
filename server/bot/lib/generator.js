const axios = require('axios');

// * Generators
async function runGenerator(generator, onRes) {
    const iterator = generator();

    try {
        for await (const value of iterator) {
            onRes(value);
            await new Promise((resolve) => setImmediate(resolve)); // Allow other tasks to be processed
        }
    } catch (error) {
        console.error('Error occurred during generator execution:', error);
    }
}

const onYield = async (bettingOpportunity) => {
    try {
        const newBetResponse = await axios.post(process.env.BASEURL +  '/scraper/new', {data: bettingOpportunity});

        if(process.env.NODE_ENV == "development") {
            if(newBetResponse.data.status == "ok") {
                console.log(`[ONYIELD] ${newBetResponse.data.message} | ${newBetResponse.data.betid}`)
            } else {
                console.log(`[ONYIELD] ERROR: ${newBetResponse.data.message}`)
            }
        }
    } catch (error) {
        console.error('[ONYIELD] ', error);
    }
};


module.exports = { onYield, runGenerator }
