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
    throw new Error(`Failed to fetch data. Response: ${response.status} - ${response.statusText}`);
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

async function getData(sport, region='eu', limiter=null) {
    const url = `${BASE_URL}/sports/${sport}/odds/`;
    const escapedUrl = encodeURI(url);
    let querystring = {
        apiKey: API_KEY,
        regions: region,
        oddsFormat: 'decimal',
        dateFormat: 'unix',
    };
    querystring = new URLSearchParams(querystring).toString();

    try {
        // ! USED FOR RATE LIMITING REQUESTS TO THE API CUZ THEY HAVE RATE LIMITS >:O
        _uri = escapedUrl + "?" +querystring
        const response = await limiter.get(_uri)

        if (!response || response.status !== 200) {
            handleFaultyResponse(response);
        }

        return response.data.filter(item => item !== 'message');
    } catch (e) {
        console.log(e)
        return []
    }

}

async function* processMatches(matches, includeStartedMatches = true) {
    const matchCount = matches.length;
    for (let i = 0; i < matchCount; i++) {
        const match = matches[i];
        const startTime = parseInt(match.commence_time);
        if (!includeStartedMatches && startTime < Date.now() / 1000) {
            continue;
        }

        const bestOddPerOutcome = {};
        for (const bookmaker of match.bookmakers) {
            const bookieName = bookmaker.title;

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

        yield {
            match_name: matchName,
            match_start_time: startTime,
            hours_to_start: timeToStart,
            league,
            best_outcome_odds: bestOddPerOutcome,
            total_implied_odds: totalImpliedOdds,
        };
    }
}

async function getArbitrageOpportunities(region, cutoff) {
    // ! DEMO MODE - READ FROM demo_data.json and return that
    if(DEMO) {
        let demo_data = fs.readFileSync(path.join(__dirname, "output", "demo_data.json"))
        demo_data = JSON.parse(demo_data)
        const demoarbitrageOpportunities = Array.from(demo_data.data).filter(x => 0 < x.total_implied_odds && x.total_implied_odds < 1 - cutoff);
        return demoarbitrageOpportunities;
    }

    // create rate limiter axios object for getting match data from API
    const limiter = rateLimit(axios.create(), { maxRequests: 25, perMilliseconds: 800, maxRPS: 25 })

    // get array of sports
    // TODO: Just add sports to array as they dont change
    const sports = await getSports(live=false);
    
    // get data for each match
    const data = chain(await Promise.all([...sports].map(sport => getData(sport, region, limiter))))
        .flatten()
        .filter(item => item !== 'message')
        .value();

    // process matches
    let results = [];
    for await (const val of processMatches(data, includeStartedMatches=false)) {
        results.push(val)
    }

    // filter opportunities
    const arbitrageOpportunities = Array.from(results).filter(x => 0 < x.total_implied_odds && x.total_implied_odds < 1 - cutoff);

    // save data to json file if SAVE_DATA is true
    if (SAVE_JSON) {
        const file_data = {"created": Date.now(), "data": arbitrageOpportunities}
        const data = JSON.stringify(file_data, null, 2);

        const filename = `data_${Date.now()}.json`;
        const filepath = path.join(__dirname, "output", filename);
        fs.writeFile(filepath, data, (err) => {
            if (err) {
                console.error("Failed writing json file! " + err);
            }
        })
    }

    return arbitrageOpportunities;
}

module.exports = {getArbitrageOpportunities}