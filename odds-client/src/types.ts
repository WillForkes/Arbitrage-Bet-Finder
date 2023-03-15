export type Region = {
    country: String, // 2 letter country code like "US" for the United States
    region: String,  // For US states this is the 2 letter state like TX for texas
                     // For the United Kingdom this could be ENG as a country like “England"
    eu: String;      // "0" for false "1" for true
    timezone: String;
    city: String;
}

export type User = {
    auth0: {
        nickname: string;
        name: string;
        picture: string;
        updated_at: string;
        email: string;
        email_verified: boolean;
        sub: string;
        sid: string;
    }
    dbuser: {
        authid: string;
        plan: string;
        planExpiresAt: string;
        whitelist: string[];
        createdAt: string;
        updatedAt: string;
        apikey: string;
        banned: boolean;
        subscription: {
            id: number;
            plan: string;
            planExpiresAt: string;
        }
    }
}

export type Bet = {
    data: {
        match_name: string;
        best_outcome_odds: OutcomeOdds
        total_implied_odds: number
        match_start_time: number
    }
    id: number
}

export enum Plan {
    starter = "starter",
    pro = "pro",
    plus = "plus"
}

export type TrackedBet = {
    id: number;
    userId: string;
    betId: number;
    totalStake: number;
    profitPercentage: number;
    createdAt: string;
    updatedAt: string;
    bet: Bet;
}

export type SpreadStake = {
    profit: number;
    outcomes: Outcome[]
}

export type Outcome = {
    outcome: string;
    stake: number;
    odds: number;
    book: string;
}

type OutcomeOdds = {
    [team1:string]: [string, number]
    [team2: string]: [string, number]
}