import { Outcome, SpreadStake } from "@/types";
import React from "react";

export default function SpreadOutcome({ c }: { c: SpreadStake | null }) {
  return (
    <div className="">
      <p>Profit ${c?.profit}</p>
      {c?.outcomes.map((outcome: Outcome) => (
        <p>
          {outcome.outcome} wins: ${outcome.stake} on {outcome.book}
        </p>
      ))}
    </div>
  );
}
