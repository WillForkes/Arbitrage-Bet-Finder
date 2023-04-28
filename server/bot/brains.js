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


async function getSports() {
    const url = `${BASE_URL}/sports/`;
    const escapedUrl = encodeURI(url);
    const querystring = {
        apiKey: API_KEY
    };
    
    let response
    try {
        response = await axios.get(escapedUrl, {params: querystring})
    } catch {
        throw new Error(`Failed to fetch sports data`);
    }

    return new Set(response.data.map(item => item.key));
}

async function getData(sport, regions, limiter=null) {
    const url = `${BASE_URL}/sports/${sport}/odds/`;
    const escapedUrl = encodeURI(url);
    let returndata = []
    const markets = ["h2h","spreads", "totals"].join(",")

    // * FOREACH REGION GET DATA
    for(let i=0; i<regions.length; i++){
        let region = regions[i]
        let querystring = {
            apiKey: API_KEY,
            regions: region,
            oddsFormat: 'decimal',
            dateFormat: 'unix',
            markets: markets
        }; // CURRENTLY ONLY WORKING H2H (moneyline)

        querystringencoded = new URLSearchParams(querystring).toString();
    
        // ! USED FOR RATE LIMITING REQUESTS TO THE API CUZ THEY HAVE RATE LIMITS >:O
        _uri = escapedUrl + "?" + querystringencoded
        let response
        try {
            response = await limiter.get(_uri)
        } catch (err) {
            if(process.env.NODE_ENV == "development") {
                console.log("Failed to fetch data for " + sport + " in " + region + "(" + err.response.data.message + ")");
                continue;
            }
            continue;
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

        if(process.env.NODE_ENV == "development") {
            console.log(`Fetched ${returndata.length} matches for ${sport} in ${region} (${i+1}/${regions.length})`)
        }
    };
    return returndata
}

function processMatches_h2h(matches, includeStartedMatches = false) {
    const matchCount = matches.length;
    let arbBets = []

    // * Arbitrage
    for (let i = 0; i < matchCount; i++) {
        const match = matches[i];
        const startTime = parseInt(match.commence_time);
        let isLive = false

        if(startTime < Date.now() / 1000) {
            isLive=true
            if (!includeStartedMatches) {
                continue;
            }
        }

        const bestOddPerOutcome = {};
        let marketType = null;
        for (const bookmaker of match.bookmakers) {
            const bookieName = bookmaker.title;

            marketType = bookmaker.markets[0].key;
            if (marketType !== "h2h") continue;

            for (const outcome of bookmaker.markets[0].outcomes) {
                const outcomeName = outcome.name;
                const odd = outcome.price; // decimal odds (e.g 0.5 = +50%)
                
                if (!bestOddPerOutcome[outcomeName] || odd > bestOddPerOutcome[outcomeName][1]) {
                    bestOddPerOutcome[outcomeName] = [bookieName, odd];
                }
            }
        }

        let totalImpliedOdds = Object.values(bestOddPerOutcome).reduce((sum, i) => sum + (1 / i[1]), 0);
        totalImpliedOdds = parseFloat(totalImpliedOdds.toFixed(4));

        if(totalImpliedOdds > 1) continue;
        
        const matchName = `${match.home_team} v. ${match.away_team}`;
        const timeToStart = (startTime - Date.now() / 1000) / 3600;
        const league = match.sport_key;
        //console.log(`Processing match ${i + 1} of ${matchCount} | ${totalImpliedOdds}`)

        arbBets.push({
            match_id: match.id,
            match_name: matchName,
            match_start_time: startTime,
            hours_to_start: timeToStart,
            league,
            key: marketType,
            best_outcome_odds: bestOddPerOutcome,
            total_implied_odds: totalImpliedOdds,
            region: match.region,
            live: isLive
        });
    }
    return arbBets
}

async function processMatches_totals(matches, includeStartedMatches = false) {
    const arbitrageBets = [];
  
  for (const match of matches) {
    const startTime = parseInt(match.commence_time);
    const timeToStart = (startTime - Date.now() / 1000) / 3600;
    let isLive = false

    if(startTime < Date.now() / 1000) {
        isLive=true
        if (!includeStartedMatches) {
            continue;
        }
    }
    
    for (let bookmaker of match.bookmakers) {
        for (let market of bookmaker.markets) {
        
            const marketOutcomes = market.outcomes;
            const marketType = market.key;

            if(marketType !== "totals") continue;
            
            for (let i = 0; i < marketOutcomes.length; i++) {
                const outcomeABookmaker = bookmaker;
                const outcomeA = marketOutcomes[i];
                
                const _outcome_b_name = (outcomeA.name == "Over") ? "Under" : "Over";
                const _outcome_b_points = outcomeA.point

                const outcomeBBookmaker = match.bookmakers.find((bk) => {
                    return bk.key !== bookmaker.key 
                    && bk.markets.some((m) => m.key === "totals" 
                    && m.outcomes.some((o) => o.name === _outcome_b_name
                    && o.point === _outcome_b_points));
                });            

                if (outcomeBBookmaker) {
                    const outcomeAOdds = outcomeA.price; // decimal odds of outcome A occuring

                    outcomeB = {
                        name: _outcome_b_name, 
                        point: _outcome_b_points, 
                        price: outcomeBBookmaker.markets.find((m) => m.key === "totals").outcomes.find((o) => o.name === _outcome_b_name && o.point === _outcome_b_points).price
                    }
                    const outcomeBOdds = outcomeB.price

                    const impliedOdds = (1 / outcomeAOdds) + (1 / outcomeBOdds);
                    
                    if(outcomeA.point != outcomeB.point) continue;

                    if (impliedOdds < 1) {
                        const boo = {
                            [outcomeA.name]: [outcomeABookmaker.title, outcomeAOdds, outcomeA.point?  outcomeA.point : null],
                            [outcomeB.name]: [outcomeBBookmaker.title, outcomeBOdds, outcomeB.point? outcomeB.point : null]
                        };

                        const arbitrageBet = {
                            match_id: match.id,
                            match_name: match.home_team + " v. " + match.away_team,
                            match_start_time: startTime,
                            hours_to_start: timeToStart,
                            league: match.sport_key,
                            key: marketType,
                            best_outcome_odds: boo,
                            total_implied_odds: impliedOdds,
                            region: match.region,
                            live: isLive
                        };
                        arbitrageBets.push(arbitrageBet);
                        }
                    }
                }
            }
        }
    }
  
    return arbitrageBets;
}

async function processMatches_spreads(matches, includeStartedMatches = false ) {
    const arbitrageBets = [];
  
    for (const match of matches) {
        const startTime = parseInt(match.commence_time);
        const timeToStart = (startTime - Date.now() / 1000) / 3600;
        let isLive = false

        if(startTime < Date.now() / 1000) {
            isLive=true
            if (!includeStartedMatches) {
                continue;
            }
        }


        for (const bookmaker of match.bookmakers) {
            for (const market of bookmaker.markets) {
            
                const marketOutcomes = market.outcomes;
                const marketType = market.key;

                if(marketType !== "spreads") continue;

                for (let i = 0; i < marketOutcomes.length; i++) {
                    const outcomeABookmaker = bookmaker;
                    const outcomeA = marketOutcomes[i];
                    
                    const _outcome_b_points = outcomeA.point * -1
                    const _outcome_b_name = (outcomeA.name == match.home_team) ? match.away_team : match.home_team;

                    const outcomeBBookmaker = match.bookmakers.find((bk) => {
                        return bk.key !== bookmaker.key 
                        && bk.markets.some((m) => m.key === "spreads" 
                        && m.outcomes.some((o) => o.name === _outcome_b_name
                        && o.point === _outcome_b_points));
                    });

                    if (outcomeBBookmaker) {
                        const outcomeAOdds = outcomeA.price; // decimal odds of outcome A occuring

                        outcomeB = {
                            name: _outcome_b_name, 
                            point: _outcome_b_points, 
                            price: outcomeBBookmaker.markets.find((m) => m.key === "spreads").outcomes.find((o) => o.name === _outcome_b_name && o.point === _outcome_b_points).price
                        }
                        const outcomeBOdds = outcomeB.price

                        const impliedOdds = (1 / outcomeAOdds) + (1 / outcomeBOdds);
                        
                        if (impliedOdds < 1) {
                            const boo = {
                                [outcomeA.name]: [outcomeABookmaker.title, outcomeAOdds, outcomeA.point?  outcomeA.point : null],
                                [outcomeB.name]: [outcomeBBookmaker.title, outcomeBOdds, outcomeB.point? outcomeB.point : null]
                            };

                            const arbitrageBet = {
                                match_id: match.id,
                                match_name: match.home_team + " v. " + match.away_team,
                                match_start_time: startTime,
                                hours_to_start: timeToStart,
                                league: match.sport_key,
                                key: "spreads",
                                best_outcome_odds: boo,
                                total_implied_odds: impliedOdds,
                                region: match.region,
                                live: isLive
                            };

                            arbitrageBets.push(arbitrageBet);
                        }
                    }
                }
            }
        }
    }

    return arbitrageBets;
}

async function getMatchByID(limiter, id, sport, region) {
    const url = `${BASE_URL}/sports/${sport}/odds/`;
    const escapedUrl = encodeURI(url);
    let returndata = []
    const markets = ["h2h","spreads","totals"].join(",")

    // * FOREACH REGION GET DATA
    let querystring = {
        apiKey: API_KEY,
        regions: region,
        oddsFormat: 'decimal',
        dateFormat: 'unix',
        markets: markets,
        eventIds: id
    };

    querystringencoded = new URLSearchParams(querystring).toString();

    // ! USED FOR RATE LIMITING REQUESTS TO THE API CUZ THEY HAVE RATE LIMITS >:O
    _uri = escapedUrl + "?" + querystringencoded
    let response
    try {
        response = await limiter.get(_uri)
    } catch (err) {
        if(process.env.NODE_ENV == "development") {
            console.log("Failed to fetch data for " + sport + " in " + region + "(" + err.response.data.message + ")");
        }
        return false;
    }

    let filtered_response = response.data.filter(item => item !== 'message');

    if(process.env.NODE_ENV == "development") {
        console.log(`[${id}] Fetched in play match data for ${sport} in ${region}`)
    }

    if(filtered_response[0] == undefined) {
        return false;
    }

    const match = filtered_response[0]

    match.region = region
    match.market = querystring.markets
    return match;
}

async function addAlternatives(data) {
    // ! For alternative outcomes - ONLY WORKS FOR USA
    let newData = []
    for(let match of data) {
        const matchIndex = data.indexOf(match)
        const americanSports = [
            "americanfootball_cfl",
            "americanfootball_ncaaf",
            "americanfootball_nfl",
            "americanfootball_nfl_super_bowl_winner",
            "americanfootball_xfl",
            "baseball_mlb",
            "baseball_mlb_preseason",
            "baseball_mlb_world_series_winner",
            "basketball_nba",
            "basketball_nba_championship_winner",
            "basketball_wnba",
            "basketball_ncaab"]
            
        if(americanSports.includes(match.sport_key)) {
            try {
                const bookmakerList = match.bookmakers.map(bk => bk.key).join(",")
                const markets = "alternate_totals,alternate_spreads"
                const url = `${BASE_URL}/sports/${match.sport_key}/events/${match.id}/odds?apiKey=${API_KEY}&markets=${markets}&oddsFormat=decimal&bookmakers=${bookmakerList}`
                const alt_resp = await axios.get(url)
                
                if(process.env.NODE_ENV == "development") {
                    console.log(`Finding alternatives for match (${match.home_team} v. ${match.away_team})`)
                }

                if(alt_resp.data.bookmakers.length > 0) {
                    // returns match data with bookmakers that have alternate totals
                    // add the outcomes to the correct bookmaker market outcomes
                    for(let z=0; z<alt_resp.data.bookmakers.length; z++){
                        let bookmaker = alt_resp.data.bookmakers[z]
                        let data_bookmakerIndex = match.bookmakers.findIndex(bk => bk.key == bookmaker.key)

                        // identify the totals market
                        for(let market of bookmaker.markets) {

                            if(market.key == "alternate_totals") {
                                // add the outcomes to the totals market
                                let totalsMarketIndex = match.bookmakers[data_bookmakerIndex].markets.findIndex(market => market.key == "totals")
                                
                                //concat the alternate totals outcomes to the totals market outcomes
                                matchIndex[matchIndex].bookmakers[data_bookmakerIndex].markets[totalsMarketIndex].outcomes = match.bookmakers[data_bookmakerIndex].markets[totalsMarketIndex].outcomes.concat(market.outcomes)
                                console.log("Added alternate totals for " + bookmaker.key + " sport:" + match.sport_key + " in " + match.region)
                            }
                            else if(market.key == "alternate_spreads") {
                                // add the outcomes to the totals market
                                let totalsMarketIndex = match.bookmakers[data_bookmakerIndex].markets.findIndex(market => market.key == "spreads")

                                //concat the alternate totals outcomes to the totals market outcomes
                                data[matchIndex].bookmakers[data_bookmakerIndex].markets[totalsMarketIndex].outcomes = match.bookmakers[data_bookmakerIndex].markets[totalsMarketIndex].outcomes.concat(market.outcomes)
                                console.log("Added alternate spreads for " + bookmaker.key + " sport:" + match.sport_key + " in " + match.region)
                            }
                        }
                    }
                }
            } catch (error) {
                if(process.env.NODE_ENV == "development") {
                    console.log("Failed to fetch alternate totals for " + match.sport_key + " in " + match.region + "(" + error + ")");
                }
                continue
            }
        }
    }

    return data
}

// ! Function to get arbitrage opportunities from the above functions
async function getArbitrageOpportunities(cutoff) {
    // ! DEMO MODE - READ FROM demo_data.json and return that
    let data
    let limiter = rateLimit(axios.create(), { maxRequests: 12, perMilliseconds: 1000, maxRPS: 10 }) // ! Adjust timings?

    if(DEMO) {
        data = fs.readFileSync(path.join(__dirname, "output", "raw.json"))
        data = JSON.parse(data)
    } else {
    // regions
        const regions = ['eu', 'uk', 'au', 'us'];

        // get array of sports
        // TODO: Just add sports to array as they dont change
        await getSports().then(async (sports) => {
            // get data for each match and all regions 
            data = chain(await Promise.all([...sports].map(sport => getData(sport, regions, limiter))))
                .flatten()
                .filter(item => item !== 'message')
                .value();
        });
    }


    // write data to output/raw.json
    fs.writeFileSync(path.join(__dirname, "output", "raw.json"), JSON.stringify(data))

    // ! IF PROCESS ENV PROD - ADD
    data = await addAlternatives(data)

    // process matches
    let arbResults_totals = await processMatches_totals(data, includeStartedMatches=true);
    let arbResult_h2h = await processMatches_h2h(data, includeStartedMatches=true);
    let arbResult_spreads = await processMatches_spreads(data, includeStartedMatches=true);
    let arbResults = [...arbResult_h2h.concat(arbResults_totals).concat(arbResult_spreads)] 
 

    // filter opportunities
    // more than 0, less than 1 - cutoff, and greater than 0.85
    const arbitrageOpportunities = Array.from(arbResults).filter(x => {
        const _pg = parseFloat(((1 / x.total_implied_odds) - 1).toFixed(3)) // percentage gain | 0.1 = 10%
        
        return 0 < x.total_implied_odds 
        && _pg > cutoff 
        && _pg < 0.15
    });

    // sort array by hours_to_start in ascending order
    arbitrageOpportunities.sort((a, b) => a.hours_to_start - b.hours_to_start);

    // save data to json file if SAVE_DATA is true
    const file_data = {
        "created": Date.now(), 
        "data": {
            "arbitrage":arbitrageOpportunities,
            "ev":[]
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

async function getInplayOpportunities(inplay_data, cutoff) {
    // create rate limiter axios object for getting match data from API
    const limiter = rateLimit(axios.create(), { maxRequests: 12, perMilliseconds: 1000, maxRPS: 10 }) // ! Adjust timings?

    // get raw match data from the match ids for each inplay_data object
    let raw_data = await Promise.all([...inplay_data].map(async (match) => {
        const betData = JSON.parse(match.data)
        const match_id = betData.match_id;
        const sport = betData.league;
        const region = betData.region;
        const rmd = getMatchByID(limiter, match_id, sport, region)
        return rmd
    }));
    raw_data = raw_data.filter(item => item != false)

    // process matches
    let arbResults_totals = await processMatches_totals(raw_data, includeStartedMatches=true);
    let arbResult_h2h = await processMatches_h2h(raw_data, includeStartedMatches=true);
    let arbResult_spreads = await processMatches_spreads(raw_data, includeStartedMatches=true);

    let arbResults = [...arbResult_h2h.concat(arbResults_totals).concat(arbResult_spreads)] 

    // TODO:  let evResults = await processPositiveEV(data, includeStartedMatches=false);
    // TODO:  let evResults = await processPositiveEV(data);
    // TODO:  evResults = [...evResults]

    // filter opportunities
    // more than 0, less than 1 - cutoff, and greater than 0.85
    const arbitrageOpportunities = Array.from(arbResults).filter(x => {
        const _pg = parseFloat(((1 / x.total_implied_odds) - 1).toFixed(3)) // percentage gain | 0.1 = 10%
        
        return 0 < x.total_implied_odds 
        && _pg > cutoff 
        && _pg < 0.15
    });
    
    // TODO: const EVOpportunities = Array.from(evResults).filter(x => x.ev < 0.3 && x.ev > 0.03);

    // sort array by hours_to_start in ascending order
    arbitrageOpportunities.sort((a, b) => a.hours_to_start - b.hours_to_start);
    // TODO: EVOpportunities.sort((a, b) => a.ev - b.ev);

    // save data to json file if SAVE_DATA is true
    const file_data = {
        "created": Date.now(), 
        "data": {
            "arbitrage":arbitrageOpportunities,
            "ev":[]
        }
    }

    return file_data
}

module.exports = {getArbitrageOpportunities, getInplayOpportunities}