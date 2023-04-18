import { UserContext } from "@/pages/_app";
import { Hedge } from "@/types";
import React, { useContext } from "react";

export default function HedgeOutcome({ c }: { c: Hedge }) {
  const user = useContext(UserContext);
  return (
    <div className="">
      {c?.outcomes.map((outcome, i) => (
        <div className="" key={i}>
          <h1>{outcome.book}</h1>
          <p>
            {outcome.outcome} win: bet {user.currency + outcome.stake} for{" "}
            {user.currency + outcome.profit} profit
          </p>
        </div>
      ))}
    </div>
  );
}
