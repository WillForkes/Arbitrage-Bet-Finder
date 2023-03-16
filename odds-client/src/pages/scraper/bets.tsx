import BetLoader from "@/components/BetLoader";
import { Bet } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Table } from "flowbite-react";
import Auth from "@/components/Auth";

export default function bets() {
  const { data, error } = useSWR("/scraper/all", getter);
  const arbData = data?.arbitrage;

  return (
    <div className="page-offset-x py-8 bg-gray-900">
      <Auth />
      {data ? (
        arbData.map((bet: Bet) => (
          <div className="drop-shadow-md rounded-md grid py-1 gap-6 grid-cols-1 2xl:grid-cols-2 mb-2">
            <BetLoader b={bet} key={bet.id} />
          </div>
        ))
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}
