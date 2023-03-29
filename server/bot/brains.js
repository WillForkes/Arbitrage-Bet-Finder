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
    const markets = ["h2h","spreads","totals"].join(",")

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

function processMatches_h2h(matches, includeStartedMatches = false) {
    const matchCount = matches.length;
    let arbBets = []

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
            if (marketType !== "h2h") continue;

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
            region: match.region
        });
    }
    return arbBets
}

function processMatches_totals(matches, includeStartedMatches = false) {
    const arbitrageBets = [];
  
  for (const match of matches) {
    const startTime = parseInt(match.commence_time);
    const timeToStart = (startTime - Date.now() / 1000) / 3600;
    if (!includeStartedMatches && startTime < Date.now() / 1000) {
        continue;
    }
    
    for (const bookmaker of match.bookmakers) {
      for (const market of bookmaker.markets) {
        
        const marketOutcomes = market.outcomes;
        const marketType = market.key;

        if(marketType !== "totals") continue;
        
        for (let i = 0; i < marketOutcomes.length; i++) {
          const outcomeA = marketOutcomes[i];

          for (let j = i+1; j < marketOutcomes.length; j++) {
            const outcomeB = marketOutcomes[j];
            const outcomeABookmaker = bookmaker;
            const outcomeBBookmaker = match.bookmakers.find((bk) => {
              return bk.key !== bookmaker.key 
              && bk.markets.some((m) => m.key === marketType 
              && m.outcomes.some((o) => o.name === outcomeB.name));
            });
            
            if (outcomeBBookmaker) {
              const outcomeAOdds = outcomeA.price;
              const outcomeBOdds = outcomeBBookmaker.markets
              .find((m) => m.key === marketType)
              .outcomes.find((o) => o.name === outcomeB.name).price;
              
              const impliedOdds = (1 / outcomeAOdds) + (1 / outcomeBOdds);
              
              if (impliedOdds < 1) {
                const arbitrageBet = {
                  match_id: match.id,
                  match_name: match.home_team + " v. " + match.away_team,
                  match_start_time: startTime,
                  hours_to_start: timeToStart,
                  league: match.sport_key,
                  key: marketType,
                  best_outcome_odds: {
                    [outcomeA.name]: [outcomeABookmaker.title, outcomeAOdds, outcomeA.point?  outcomeA.point : null],
                    [outcomeB.name]: [outcomeBBookmaker.title, outcomeBOdds, outcomeB.point? outcomeB.point : null]
                  },
                  total_implied_odds: impliedOdds,
                  region: match.region
                };
                arbitrageBets.push(arbitrageBet);
              }
            }
          }
        }
      }
    }
  }
  
  return arbitrageBets;
}

function processPositiveEV(matches, includeStartedMatches = true) {
    let positiveBets = [];
    let totalNoEV = 0
    let totalPositiveEV = 0

    for (let i = 0; i < matches.length; i++) {
        let match = matches[i];
        const startTime = parseInt(match.commence_time);
        const timeToStart = (startTime - Date.now() / 1000) / 3600;
        if (!includeStartedMatches && startTime < Date.now() / 1000) {
            continue;
        }

        for (let j = 0; j < match.bookmakers.length; j++) {
        let bookmaker = match.bookmakers[j];

        for (let k = 0; k < bookmaker.markets.length; k++) {
            let market = bookmaker.markets[k];

            let homeTeamOutcome = market.outcomes.find(
                (outcome) => outcome.name === match.home_team || market.key === "totals" && outcome.name === "Over"
            );
            let awayTeamOutcome = market.outcomes.find(
                (outcome) => outcome.name === match.away_team || market.key === "totals" && outcome.name === "Under"
            );
            let drawOutcome = market.outcomes.find(
                (outcome) => outcome.name.toLowerCase() === "draw"
            );

            if(!homeTeamOutcome || !awayTeamOutcome) continue;

            const hasDraw = drawOutcome? true : false;

            // * this is the implied probability of the outcome, with the bookmaker's vig included (so not accurate)
            ht_impliedProbability = 1 / homeTeamOutcome.price;
            at_impliedProbability = 1 / awayTeamOutcome.price;
            draw_impliedProbability = hasDraw ? 1 / drawOutcome.price : 0;
            sum_impliedProbability = ht_impliedProbability + at_impliedProbability + draw_impliedProbability;

            // * this is the true probability of the outcome, without the bookmaker's vig in percentage
            ht_noVig = ht_impliedProbability / sum_impliedProbability;
            at_noVig = at_impliedProbability / sum_impliedProbability;
            draw_noVig = hasDraw ? draw_impliedProbability / sum_impliedProbability : 0;

            ht_noVig_odds = 1 / ht_noVig;
            at_noVig_odds = 1 / at_noVig;
            draw_noVig_odds = hasDraw ? 1 / draw_noVig : 0;
            

            // (Amount won per bet * probability of winning) – (Amount lost per bet * probability of losing)
            ht_EV = ((homeTeamOutcome.price - 1) * ht_noVig) - (1*(1-ht_noVig))
            at_EV = ((awayTeamOutcome.price - 1) * at_noVig) - (1*(1-at_noVig))
            draw_EV = hasDraw ? ((drawOutcome.price - 1) * draw_noVig) - (1*(1-draw_noVig)) : 0

            let outcomeToBetOn
            let winProbability
            let odds
            let noVigOdds 
            let ev

            let shouldBet = (ht_EV > 0 || at_EV > 0 || draw_EV > 0) ? true : false;
            
            if(ht_EV > 0){
                outcomeToBetOn = match.home_team
                winProbability = ht_noVig
                odds = homeTeamOutcome.price
                noVigOdds = ht_noVig_odds
                ev = ht_EV
            } else if(at_EV > 0){
                outcomeToBetOn = match.away_team
                winProbability = at_noVig
                odds = awayTeamOutcome.price
                noVigOdds = at_noVig_odds
                ev = at_EV
            } else if(draw_EV > 0){
                outcomeToBetOn = "Draw"
                winProbability = draw_noVig
                odds = drawOutcome.price
                noVigOdds = draw_noVig_odds
                ev = draw_EV
            }
            
            if(shouldBet) {
                const matchName = `${match.home_team} v. ${match.away_team}`;
                const timeToStart = (startTime - Date.now() / 1000) / 3600;
                const league = match.sport_key;

                positiveBets.push({
                    match_id: match.id,
                    match_name: matchName,
                    team: outcomeToBetOn,
                    match_start_time: startTime,
                    hours_to_start: timeToStart,
                    league,
                    key: market.key,
                    bookmaker: bookmaker.title,
                    winProbability: winProbability,
                    odds: odds,
                    noVigOdds: noVigOdds,
                    ev: ev.toFixed(3),
                    region: match.region
                });
            }

            }
        }
    }
    
    return positiveBets;
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

    // write data to output/raw.json
    fs.writeFileSync(path.join(__dirname, "output", "raw.json"), JSON.stringify(data))
 
    // process matches
    let arbResults_totals = await processMatches_totals(data, includeStartedMatches=false);
    let arbResult_h2h = await processMatches_h2h(data, includeStartedMatches=false);
    let arbResults = [...arbResult_h2h.concat(arbResults_totals)]

    //let evResults = await processPositiveEV(data, includeStartedMatches=false);
    let evResults = await processPositiveEV(data);
    evResults = [...evResults]

    // filter opportunities
    const arbitrageOpportunities = Array.from(arbResults).filter(x => 0 < x.total_implied_odds && x.total_implied_odds < 1 - cutoff && x.total_implied_odds > 0.85);
    const EVOpportunities = Array.from(evResults).filter(x => x.ev < 0.4 && x.ev > 0.05);

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