import BetLoader from "@/components/BetLoader";
import { Bet } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";

export default function bets() {
  const { data, error } = useSWR("/scraper/all", getter);
  return (
    <div>
      {data ? <h1>Loaded {data.length}</h1> : null}
      {data ? (
        data.map((bet: Bet) => (
          <div className="grid gap-6 grid-cols-1 2xl:grid-cols-2 mb-6">
            <BetLoader b={bet} key={bet.id} />
          </div>
        ))
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}
