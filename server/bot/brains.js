//! api docs: https://the-odds-api.com/liveapi/guides/v4/#schema-2
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const fs = require('fs');
const path = require('path');
const { chain } = require('lodash');
const {
    BASE_URL,
    API_KEY,
    DEMO,
    SAVE_JSON
} = require('./constants');
const {getSports, getData, getMatchByID} = require('./lib/loadData')
const { processMatches_h2h, processMatches_spreads, processMatches_totals} = require('./lib/processData')
const { runGenerator, onYield } = require('./lib/generator')
const { addAlternatives } = require('./lib/alternatives')

const sports = [
    "americanfootball_cfl",
    "americanfootball_ncaaf",
    "americanfootball_nfl",
    "americanfootball_nfl_super_bowl_winner",
    "americanfootball_xfl",
    "aussierules_afl",
    "baseball_mlb",
    "baseball_mlb_preseason",
    "baseball_mlb_world_series_winner",
    "basketball_euroleague",
    "basketball_nba",
    "basketball_nba_championship_winner",
    "basketball_wnba",
    "basketball_ncaab",
    "cricket_big_bash",
    "cricket_caribbean_premier_league",
    "cricket_icc_world_cup",
    "cricket_international_t20",
    "cricket_ipl",
    "cricket_odi",
    "cricket_psl",
    "cricket_test_match",
    "golf_masters_tournament_winner",
    "golf_pga_championship_winner",
    "golf_the_open_championship_winner",
    "golf_us_open_winner",
    "icehockey_nhl",
    "icehockey_nhl_championship_winner",
    "icehockey_sweden_hockey_league",
    "icehockey_sweden_allsvenskan",
    "mma_mixed_martial_arts",
    "politics_us_presidential_election_winner",
    "rugbyleague_nrl",
    "soccer_africa_cup_of_nations",
    "soccer_argentina_primera_division",
    "soccer_australia_aleague",
    "soccer_austria_bundesliga",
    "soccer_belgium_first_div",
    "soccer_brazil_campeonato",
    "soccer_brazil_serie_b",
    "soccer_chile_campeonato",
    "soccer_china_superleague",
    "soccer_denmark_superliga",
    "soccer_efl_champ",
    "soccer_england_efl_cup",
    "soccer_england_league1",
    "soccer_england_league2",
    "soccer_epl",
    "soccer_fa_cup",
    "soccer_fifa_world_cup",
    "soccer_fifa_world_cup_winner",
    "soccer_finland_veikkausliiga",
    "soccer_france_ligue_one",
    "soccer_france_ligue_two",
    "soccer_germany_bundesliga",
    "soccer_germany_bundesliga2",
    "soccer_germany_liga3",
    "soccer_greece_super_league",
    "soccer_italy_serie_a",
    "soccer_italy_serie_b",
    "soccer_japan_j_league",
    "soccer_korea_kleague1",
    "soccer_league_of_ireland",
    "soccer_mexico_ligamx",
    "soccer_netherlands_eredivisie",
    "soccer_norway_eliteserien",
    "soccer_poland_ekstraklasa",
    "soccer_portugal_primeira_liga",
    "soccer_russia_premier_league",
    "soccer_spain_la_liga",
    "soccer_spain_segunda_division",
    "soccer_spl",
    "soccer_sweden_allsvenskan",
    "soccer_sweden_superettan",
    "soccer_switzerland_superleague",
    "soccer_turkey_super_league",
    "soccer_uefa_europa_conference_league",
    "soccer_uefa_champs_league",
    "soccer_uefa_europa_league",
    "soccer_uefa_nations_league",
    "soccer_conmebol_copa_libertadores",
    "soccer_usa_mls",
    "tennis_atp_aus_open_singles",
    "tennis_atp_french_open",
    "tennis_atp_us_open",
    "tennis_atp_wimbledon",
    "tennis_wta_aus_open_singles",
    "tennis_wta_french_open",
    "tennis_wta_us_open",
    "tennis_wta_wimbledon"   
]

// ! Function to get arbitrage opportunities from the above functions
async function getArbitrageOpportunities() {
    let data;
    let limiter = rateLimit(axios.create(), { maxRequests: 12, perMilliseconds: 1000, maxRPS: 10 }); // ! Adjust timings?

    if (DEMO) {
        // use demo data
        data = fs.readFileSync(path.join(__dirname, "output", "raw.json"));
        data = JSON.parse(data);
    } else {
        // regions
        const regions = ['eu', 'uk', 'au', 'us'];

        // get data for each match and all regions
        data = chain(await Promise.all([...sports].map((sport) => getData(sport, regions, limiter))))
            .flatten()
            .filter((item) => item !== 'message')
            .value();
    }

    // write data to output/raw.json
    fs.writeFileSync(path.join(__dirname, "output", "raw.json"), JSON.stringify(data));

    // ! IF PROCESS ENV PROD - ADD
    data = await addAlternatives(data);

    // process matches
    const h2h = runGenerator(() => processMatches_h2h(data, (includeStartedMatches = true)), onYield);
    const totals = runGenerator(() => processMatches_totals(data, (includeStartedMatches = true)), onYield);
    const spreads = runGenerator(() => processMatches_spreads(data, (includeStartedMatches = true)), onYield);

    try {
        await Promise.all([h2h, totals, spreads]);
        console.log("[SCRAPER] Run processing complete.");
        return true;
    } catch (error) {
        console.error("Error occurred during processing:", error);
        return false;
    }
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
    const h2h = runGenerator(() => processMatches_h2h(raw_data, includeStartedMatches = true), onYield);
    const totals = runGenerator(() => processMatches_totals(raw_data, includeStartedMatches = true), onYield);
    const spreads = runGenerator(() => processMatches_spreads(raw_data, includeStartedMatches = true), onYield);

    try {
        await Promise.all([h2h, totals, spreads]);
        console.log("[SCRAPER] In-play run processing complete.");
        return true;
    } catch (error) {
        console.error("Error occurred during processing:", error);
        return false;
    }
}



module.exports = {getArbitrageOpportunities, getInplayOpportunities}