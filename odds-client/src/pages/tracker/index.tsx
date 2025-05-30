import BetLoader from "@/components/BetLoader";
import { Tracker } from "@/types";
import React, { useState, useContext } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Spinner } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import Auth from "@/components/Auth";
import TrackedBetLoader from "@/components/TrackedBetLoader";
import ChartLoader from "@/components/ChartLoader";
import Head from "next/head";

export default function TrackerPage() {
  const { data, error } = useSWR("/tracker/all", getter, {
    refreshInterval: 1000,
  });
  const trackedBets = data;
  const user: User | null = useContext(UserContext).user;

  return (
    <div className="page-offset-x py-8 bg-gray-900">
        <Head>
            <title>Arbster | Bet Tracker</title>
            <meta name="description" content="Arbsters intuitive bet tracking tool to keep a record of your betting success" />
        </Head>
      <Auth />
      {data ? (
        <div className="rounded-md grid py-1 gap-6 grid-cols-1 mb-2">
          <ChartLoader d={trackedBets} />
          <TrackedBetLoader bets={trackedBets} />
        </div>
      ) : (
        <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
          <Spinner aria-label="Default status example" />
        </div>
      )}
    </div>
  );
}
