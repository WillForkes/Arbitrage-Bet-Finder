export type Bet = {
    data: {
        match_name: string;
        best_outcome_odds: Outcome
        total_implied_odds: number
    }
    id: number
    
}

type Outcome = {
    [team1:string]: [string, number]
    [team2: string]: [string, number]
}