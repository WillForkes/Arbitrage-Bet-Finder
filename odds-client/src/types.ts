export type Bet = {
    data: {
        match_name: string;
        best_outcome_odds: OutcomeOdds
        total_implied_odds: number
    }
    id: number
    
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

