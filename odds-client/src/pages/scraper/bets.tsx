import BetLoader from "@/components/BetLoader";
import { Bet } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Spinner } from "flowbite-react";
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
        <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
          <Spinner aria-label="Default status example" />
        </div>
      )}
    </div>
  );
}
