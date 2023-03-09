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
        data.map((bet: Bet) => <BetLoader b={bet} key={bet.id} />)
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}
