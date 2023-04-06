import BetLoader from "@/components/BetLoader";
import { Bet, EV } from "@/types";
import React, { useState, useContext } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import EVLoader from "@/components/EV";
import Auth from "@/components/Auth";
import { Spinner } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";

export default function Ev() {
  const { data, error } = useSWR("/scraper/all?type=ev", getter, {
    refreshInterval: 10000,
  });
  const evData = data?.ev;
  const user: User | null = useContext(UserContext).user;
  const showBets = user
    ? user.dbuser.plan == "pro" ||
      user.dbuser.plan == "plus" ||
      user.dbuser.staff
    : false;

  return (
    <div className="page-offset-x py-8 bg-gray-900">
      {data ? (
        <div className="rounded-md gap-6 grid-cols-1 2xl:grid-cols-2 mb-2">
          <EVLoader bets={evData} showBets={showBets} user={user} />
        </div>
      ) : (
        <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
          <Spinner aria-label="Default status example" />
        </div>
      )}
    </div>
  );
}
