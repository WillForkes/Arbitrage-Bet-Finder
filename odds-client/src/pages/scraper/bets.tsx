import BetLoader from "@/components/BetLoader";
import { Bet } from "@/types";
import React, { useState, useContext } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Spinner } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import Auth from "@/components/Auth";

export default function bets() {
  const { data, error } = useSWR("/scraper/all", getter, {
    refreshInterval: 10000,
  });
  const arbData = data?.arbitrage;
  const user: User | null = useContext(UserContext).user;
  const showBets = user
    ? user.dbuser.plan == "pro" || user.dbuser.plan == "plus"
    : false;

  return (
    <div className="page-offset-x py-8 bg-gray-900">
      <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        {/* <span className="font-bold tracking-wider uppercase dark:text-primary-700">
                Arbitrage Tool
            </span>
            <h2 className="text-4xl font-bold lg:text-5xl">
                Risk free betting
            </h2> */}
        <a
          href="#"
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          role="alert"
        >
          <span className="text-xs bg-primary-700 rounded-full text-white px-4 py-1.5 mr-3">
            Learn
          </span>{" "}
          <span className="text-sm font-medium">
            Learn how our arbitrage tool works
          </span>
          <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
          </svg>
        </a>
      </div>

      {data ? (
        <div className="rounded-md gap-6 grid-cols-1 2xl:grid-cols-2 mb-2">
          <BetLoader bets={arbData} showBets={showBets} user={user} />
        </div>
      ) : (
        <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
          <Spinner aria-label="Default status example" />
        </div>
      )}
    </div>
  );
}
