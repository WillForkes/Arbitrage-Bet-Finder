const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const fs = require('fs');
const path = require('path');
const {
    chain
} = require('lodash');
const {
    BASE_URL,
    API_KEY
} = require('../constants');
const { runGenerator } = require('./generator');

function* processMatches_h2h(matches, includeStartedMatches = false) {
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

        const arbOpp = {
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
        }
        if(isOverCutoff(arbOpp)) {
            yield arbOpp;
        }
    }
    //return arbBets
}

async function* processMatches_totals(matches, includeStartedMatches = false) {
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

                            const arbOpp = {
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
                            }
                            if(isOverCutoff(arbOpp)) {
                                yield arbOpp;
                            }
                        }
                    }
                }
            }
        }
    }
}

async function* processMatches_spreads(matches, includeStartedMatches = false ) {
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

                            const arbOpp = {
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

                            if(isOverCutoff(arbOpp)) {
                                yield arbOpp;
                            }
                        }
                    }
                }
            }
        }
    }
}


// * Is over cutoff
function isOverCutoff(arbOpp) {
    const _pg = parseFloat(((1 / arbOpp.total_implied_odds) - 1).toFixed(3)) // percentage gain | 0.1 = 10%
        
    return 0 < arbOpp.total_implied_odds  && _pg > 0.01  && _pg < 0.20
}

module.exports = {processMatches_h2h, processMatches_totals, processMatches_spreads, runGenerator}