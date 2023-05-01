import { UserContext } from "@/pages/_app";
import { Outcome, SpreadStake } from "@/types";
import { regionCurrency } from "@/utils";
import React, { useContext } from "react";

export default function SpreadOutcome({ c }: { c: SpreadStake }) {
  const user = useContext(UserContext);
  return (
    <div className="">
      <div className="">
        {c ? (
          <div>
            <p className="font-bold mb-2">
              Profit: {user.currency}
              {c.profit}
            </p>
          </div>
        ) : null}
      </div>
      <div
        className={`grid grid-cols-1 lg:grid-cols-${
          c ? c.outcomes.length : 0
        } auto-cols`}
      >
        {c?.outcomes.map((outcome: Outcome, i) => (
          <div key={i} className="p-2">
            <div>
              <p className="font-bold mb-2">{outcome.outcome} wins:</p>
              <p>
                {user.currency}
                {outcome.stake} on {outcome.book}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
