import BetLoader from "@/components/BetLoader";
import { Bet } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";

export default function bets() {
  const { data, error } = useSWR("/scraper/all", getter);
  return (
    <div className="page-offset-x py-8 bg-black-700">
      {data ? (
        data.map((bet: Bet) => (
          <div className="bg-gray-800 drop-shadow-md rounded-md grid py-3 gap-6 grid-cols-1 2xl:grid-cols-2 mb-6">
            <BetLoader b={bet} key={bet.id} />
          </div>
        ))
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}
