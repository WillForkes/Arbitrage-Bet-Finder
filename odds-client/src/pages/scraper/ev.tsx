import BetLoader from "@/components/BetLoader";
import { Bet, EV } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import EVLoader from "@/components/EV";

export default function ev() {
  const { data, error } = useSWR("/scraper/all", getter);
  const evData = data?.ev;
  console.log(evData);
  return (
    <div className="page-offset-x py-8 bg-black-700">
      {data ? (
        evData.map((bet: EV) => (
          <div className="bg-gray-800 drop-shadow-md rounded-md grid py-3 gap-6 grid-cols-1 2xl:grid-cols-2 mb-6">
            <EVLoader b={bet} key={bet.id} />
          </div>
        ))
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}
