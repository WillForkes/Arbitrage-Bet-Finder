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
const { processMatches_h2h, processMatches_spreads, processMatches_totals} = require('./processData')
const { runGenerator, onYield } = require('./generator')

async function addAlternatives(data) {
    // ! For alternative outcomes - ONLY WORKS FOR USA
    let workers = []
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
        "basketball_ncaab"
    ]

    for(let match of data) {
        const matchIndex = data.indexOf(match)

        // Check if match is live ! cant have live matches as processing time for alts is too long and they update too fast
        const startTime = parseInt(match.commence_time);

        if(startTime < (Date.now() / 1000)) {
            continue;
        }
            
        if(americanSports.includes(match.sport_key)) {
            try {
                const bookmakerList = match.bookmakers.map(bk => bk.key).join(",")
                const markets = "alternate_totals,alternate_spreads"
                const url = `${BASE_URL}/sports/${match.sport_key}/events/${match.id}/odds?apiKey=${API_KEY}&markets=${markets}&oddsFormat=decimal&bookmakers=${bookmakerList}`
                const alt_resp = await axios.get(url)

                if(alt_resp.data.bookmakers.length > 0) {
                    // returns match data with bookmakers that have alternate totals
                    // add the outcomes to the correct bookmaker market outcomes
                    for(let z=0; z<alt_resp.data.bookmakers.length; z++){
                        let bookmaker = alt_resp.data.bookmakers[z]
                        let data_bookmakerIndex = match.bookmakers.findIndex(bk => bk.key == bookmaker.key)

                        // identify the totals market
                        for(let market of bookmaker.markets) {
                            if(process.env.NODE_ENV == "development") {
                                console.log("Added alternatives to +1 match")
                            }

                            if(market.key == "alternate_totals") {
                                // add the outcomes to the totals market
                                let totalsMarketIndex = match.bookmakers[data_bookmakerIndex].markets.findIndex(market => market.key == "totals")
                                
                                //concat the alternate totals outcomes to the totals market outcomes
                                data[matchIndex].bookmakers[data_bookmakerIndex].markets[totalsMarketIndex].outcomes = match.bookmakers[data_bookmakerIndex].markets[totalsMarketIndex].outcomes.concat(market.outcomes)
                            }
                            else if(market.key == "alternate_spreads") {
                                // add the outcomes to the totals market
                                let totalsMarketIndex = match.bookmakers[data_bookmakerIndex].markets.findIndex(market => market.key == "spreads")

                                //concat the alternate totals outcomes to the totals market outcomes
                                data[matchIndex].bookmakers[data_bookmakerIndex].markets[totalsMarketIndex].outcomes = match.bookmakers[data_bookmakerIndex].markets[totalsMarketIndex].outcomes.concat(market.outcomes)
                            }
                        }
                    }
                }

                const w1 = runGenerator(() => processMatches_h2h([match], includeStartedMatches = true), onYield);
                const w2 = runGenerator(() => processMatches_totals([match], includeStartedMatches = true), onYield);
                const w3 = runGenerator(() => processMatches_spreads([match], includeStartedMatches = true), onYield);
                workers.push(w1, w2, w3)
            } catch (error) {
                if(process.env.NODE_ENV == "development") {
                    console.log("[ALTERANTIVES] Error fetching alternatives: ", error);
                }
                continue
            }
        }
    }

    return workers
}

module.exports = {addAlternatives}