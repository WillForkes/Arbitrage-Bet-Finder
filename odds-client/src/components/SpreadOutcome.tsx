import { UserContext } from "@/pages/_app";
import { Outcome, SpreadStake } from "@/types";
import { regionCurrency } from "@/utils";
import React, { useContext } from "react";

export default function SpreadOutcome({ c }: { c: SpreadStake }) {
  const user = useContext(UserContext);
  return (
    <div className="">
      <p>Profit ${c?.profit}</p>
      {c?.outcomes.map((outcome: Outcome, i) => (
        <p key={i}>
          {outcome.outcome} wins: {user.currency + outcome.stake} on{" "}
          {outcome.book}
        </p>
      ))}
    </div>
  );
}
