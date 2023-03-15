//! api docs: https://the-odds-api.com/liveapi/guides/v4/#schema-2


const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const fs = require('fs');
const path = require('path');

const {
    chain
} = require('lodash');
const {
    BASE_URL,
    API_KEY,
    DEMO,
    SAVE_JSON
} = require('./constants');

function handleFaultyResponse(response) {
    if (response.status === 429) {
        console.log("Rate limit reached");
    } else {
        console.log("Error status: " + response.status + " - " + response.statusText);
    }
    //throw new Error(`Failed to fetch data. Response: ${response.status} - ${response.statusText}`);
}

async function getSports() {
    const url = `${BASE_URL}/sports/`;
    const escapedUrl = encodeURI(url);
    const querystring = {
        apiKey: API_KEY
    };
    
    const response = await axios.get(escapedUrl, {
        params: querystring
    });
    if (!response) {
        handleFaultyResponse(response);
    }

    return new Set(response.data.map(item => item.key));
}

async function getData(sport, regions, limiter=null) {
    const url = `${BASE_URL}/sports/${sport}/odds/`;
    const escapedUrl = encodeURI(url);
    let returndata = []
    const markets = ["h2h","spreads","totals","outrights"].join(",")

    // * FOREACH REGION GET DATA
    for(let i=0; i<regions.length; i++){

        let region = regions[i]
        let querystring = {
            apiKey: API_KEY,
            regions: region,
            oddsFormat: 'decimal',
            dateFormat: 'unix'
        }; // CURRENTLY ONLY H2H (moneyline)

        querystringencoded = new URLSearchParams(querystring).toString();
    
        // ! USED FOR RATE LIMITING REQUESTS TO THE API CUZ THEY HAVE RATE LIMITS >:O
        _uri = escapedUrl + "?" + querystringencoded
        let response
        try {
            response = await limiter.get(_uri)
        } catch (error) {
            console.log(error);
            continue
        }

        let filtered_response = response.data.filter(item => item !== 'message');
        for(let j=0; j<filtered_response.length; j++){
            filtered_response[j].region = region
            let match = filtered_response[j]

            if(match.bookmakers.length > 0){
                match.region = region
                match.market = querystring.markets
                returndata.push(match);
            }
        }
    };
    return returndata
}

async function* processMatches(matches, includeStartedMatches = true) {
    const matchCount = matches.length;

    // * Arbitrage
    for (let i = 0; i < matchCount; i++) {
        const match = matches[i];
        const startTime = parseInt(match.commence_time);
        if (!includeStartedMatches && startTime < Date.now() / 1000) {
            continue;
        }

        const bestOddPerOutcome = {};
        let marketType = null;
        for (const bookmaker of match.bookmakers) {
            const bookieName = bookmaker.title;

            marketType = bookmaker.markets[0].key;

            for (const outcome of bookmaker.markets[0].outcomes) {
                const outcomeName = outcome.name;
                const odd = outcome.price; // decimal odds (e.g 0.5 = +50%)
                
                if (!bestOddPerOutcome[outcomeName] || odd > bestOddPerOutcome[outcomeName][1]) {
                    bestOddPerOutcome[outcomeName] = [bookieName, odd];
                }
            }
        }

        let totalImpliedOdds = Object.values(bestOddPerOutcome).reduce((sum, i) => sum + 1 / i[1], 0);
        totalImpliedOdds = parseFloat(totalImpliedOdds.toFixed(4));

        const matchName = `${match.home_team} v. ${match.away_team}`;
        const timeToStart = (startTime - Date.now() / 1000) / 3600;
        const league = match.sport_key;
        //console.log(`Processing match ${i + 1} of ${matchCount} | ${totalImpliedOdds}`)

        yield {
            match_id: match.id,
            match_name: matchName,
            match_start_time: startTime,
            hours_to_start: timeToStart,
            league,
            key: marketType,
            best_outcome_odds: bestOddPerOutcome,
            total_implied_odds: totalImpliedOdds,
            region: match.region
        };
    }
}

function averageOdds(match, i) {
    let odds = [];
    match.bookmakers.forEach(book => {
        if (book.markets[0].key == 'h2h') {
            try{
                odds.push(book.markets[0].outcomes[i].price)
            } 
            catch (error) {
                return false
            }
        }
        
    })
    return odds
}

function sumAverage(odds) {
    return odds.reduce((a, b) => a + b) / odds.length;
}

async function processPositiveEV(matches, includeStartedMatches = false) {
    // probability of winning = 1 / odds
    // amount lost per bet = stake
    // probability of losing = 1 / odds

    // find all matches with an ev > 0 from the matches array
    let positiveBets = [];
    
    matches.forEach(match => {
        const startTime = parseInt(match.commence_time);
        if (!includeStartedMatches && startTime < Date.now() / 1000) {
            return;
        }

        match.bookmakers.forEach(bookmaker => {
            bookmaker.markets.forEach(market => {
                if (market.key != 'h2h') return;

                market.outcomes.forEach((outcome, i) => {
                    let odds = averageOdds(match, i);
                    let sumAvg = sumAverage(odds);
                    if(!sumAvg){
                        return
                    }
                    let probability = 1/Math.abs(sumAvg);
                    let amountWon = Math.abs(outcome.price) - 1
                    let amountLost = Math.abs(outcome.price);
                    let ev = (amountWon*probability)-(1*(1-probability));

                    if ((ev/1).toFixed(3) > 0.01) {

                        const matchName = `${match.home_team} v. ${match.away_team}`;
                        const timeToStart = (startTime - Date.now() / 1000) / 3600;
                        const league = match.sport_key;

                        positiveBets.push({
                            match_id: match.id,
                            match_name: matchName,
                            match_start_time: startTime,
                            hours_to_start: timeToStart,
                            league,
                            key: "h2h",
                            bookmaker: bookmaker.title,
                            winProbability: probability,
                            odds: outcome.price,
                            ev: ev.toFixed(3),
                            region: match.region
                        });
                        console.log(probability, outcome.price)
                    }
                });
            });
        });
    });
    return positiveBets;
}

async function findPositiveEVBets(data, includeStartedMatches = false) {
    let positiveEVBets = [];

    for (let i = 0; i < data.length; i++) {
        let match = data[i];
        let bookmakers = match.bookmakers;

        for (let j = 0; j < bookmakers.length; j++) {
            let markets = bookmakers[j].markets;

            for (let k = 0; k < markets.length; k++) {
                if (markets[k].key === 'h2h') {
                    let outcomes = markets[k].outcomes;
                    let totalProbability = 0;

                    for (let l = 0; l < outcomes.length; l++) {
                        totalProbability += outcomes[l].price;
                    }
                    totalProbability = totalProbability / outcomes.length;
                    totalProbability = 1/ totalProbability;
                    for (let l = 0; l < outcomes.length; l++) {
                        let probability = 1 / outcomes[l].price;
                        let expectedValue = ((outcomes[l].price - 1) * totalProbability) - (1 - totalProbability);

                        if (expectedValue > 0) {
                            const startTime = parseInt(match.commence_time);
                            if (!includeStartedMatches && startTime < Date.now() / 1000) {
                                continue;
                            }
                            const matchName = `${match.home_team} v. ${match.away_team}`;
                            const timeToStart = (startTime - Date.now() / 1000) / 3600;
                            const league = match.sport_key;
                            positiveEVBets.push({
                                match_id: match.id,
                                match_name: matchName,
                                match_start_time: startTime,
                                hours_to_start: timeToStart,
                                league,
                                key: "h2h",
                                ev: expectedValue,
                                bookmaker: bookmakers[j].title,
                                odds: outcomes[l].price,
                                winProbability: probability,
                                region: match.region
                            });
                        }
                    }
                }
            }
        }
    }

    return positiveEVBets;
}


// ! Function to get arbitrage opportunities from the above functions
async function getArbitrageOpportunities(cutoff) {
    // ! DEMO MODE - READ FROM demo_data.json and return that
    let data
    if(DEMO) {
        data = fs.readFileSync(path.join(__dirname, "output", "raw.json"))
        data = JSON.parse(data)
    } else {
    // regions
        const regions = ['eu', 'uk', 'au', 'us'];

        // create rate limiter axios object for getting match data from API
        const limiter = rateLimit(axios.create(), { maxRequests: 6, perMilliseconds: 150, maxRPS: 15 })

        // get array of sports
        // TODO: Just add sports to array as they dont change
        const sports = await getSports();
        
        // get data for each match and all regions 
        data = chain(await Promise.all([...sports].map(sport => getData(sport, regions, limiter))))
            .flatten()
            .filter(item => item !== 'message')
            .value();
    }

    // process matches
    let results = [];
    for await (const val of processMatches(data, includeStartedMatches=false)) {
        results.push(val)
    }

    //let evResults = await processPositiveEV(data, includeStartedMatches=false);
    let evResults = await processPositiveEV(data);
    evResults = [...evResults]

    // filter opportunities
    const arbitrageOpportunities = Array.from(results).filter(x => 0 < x.total_implied_odds && x.total_implied_odds < 1 - cutoff);
    const EVOpportunities = Array.from(evResults).filter(x => x.ev > 0.1);

    // sort array by hours_to_start in ascending order
    arbitrageOpportunities.sort((a, b) => a.hours_to_start - b.hours_to_start);
    EVOpportunities.sort((a, b) => a.ev - b.ev);

    // save data to json file if SAVE_DATA is true
    const file_data = {
        "created": Date.now(), 
        "data": {
            "arbitrage":arbitrageOpportunities,
            "ev":EVOpportunities
        }
    }

    if (SAVE_JSON) {
        const data = JSON.stringify(file_data, null, 2);

        const filename = `data_${Date.now()}.json`;
        const filepath = path.join(__dirname, "output", filename);
        fs.writeFile(filepath, data, (err) => {
            if (err) {
                console.error("Failed writing json file! " + err);
            }
        })
    }

    return file_data
}

module.exports = {getArbitrageOpportunities}