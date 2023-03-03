// Get latest arbitrage data
// If data is outdated by more than 10 minutes, get new data

async function getArbitrageData() {
    return new Promise((resolve, reject) => {
        // get current time
        const now = new Date();
        const lastUpdated = new Date(); // ! UPDATE

        // if data is outdated, get new data
        if (now - lastUpdated > 600000) {
            console.log("Data is outdated. Getting new data...");
            getArbitrageDataFromAPI().then((arb_data) => {
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

async function getArbitrageDataFromAPI() {
    return new Promise((resolve, reject) => {
        // get data from API
        // ! UPDATE
        resolve({"data": "TEST_DATA"})
    });
}

module.exports = {getArbitrageData}