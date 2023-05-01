import { UserContext } from "@/pages/_app";
import { Hedge } from "@/types";
import React, { useContext } from "react";

export default function HedgeOutcome({ c }: { c: Hedge }) {
  const user = useContext(UserContext);

  return (
    <div className="">
      {c?.outcomes.map((outcome, i) => (
        <div className="mb-2" key={i}>
          <p>
            <p className="font-extrabold">{outcome.book}</p>
            {outcome.outcome} win: bet {user.currency + outcome.stake} for{" "}
            {user.currency + outcome.profit} profit
          </p>
        </div>
      ))}
    </div>
  );
}
