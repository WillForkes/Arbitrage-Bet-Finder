import { Hedge } from "@/types";
import React from "react";

export default function HedgeOutcome({ c }: { c: Hedge | null }) {
  return (
    <div className="">
      {c?.outcomes.map((outcome) => (
        <div className="">
          <h1>{outcome.book}</h1>
          <p>
            {outcome.outcome} win: bet ${outcome.stake} for ${outcome.profit}{" "}
            profit
          </p>
        </div>
      ))}
    </div>
  );
}