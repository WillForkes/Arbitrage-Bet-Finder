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
    let workers = []
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

        // Run generators on the matches
        if(filtered_response.length > 0) {
            const w1 = runGenerator(() => processMatches_h2h(filtered_response, includeStartedMatches = true), onYield);
            const w2 = runGenerator(() => processMatches_totals(filtered_response, includeStartedMatches = true), onYield);
            const w3 = runGenerator(() => processMatches_spreads(filtered_response, includeStartedMatches = true), onYield);
            workers.push(w1, w2, w3)
        }

        if(process.env.NODE_ENV == "development") {
            console.log(`Fetched ${returndata.length} matches for ${sport} in ${region} (${i+1}/${regions.length})`)
        }
    };

    return {"workers": workers, "data": returndata};
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

module.exports = {getSports, getData, getMatchByID}