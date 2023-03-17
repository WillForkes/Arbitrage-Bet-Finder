import BetLoader from "@/components/BetLoader";
import { Bet, EV } from "@/types";
import React, { useState, useContext } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import EVLoader from "@/components/EV";
import { Spinner } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";

export default function ev() {
  const { data, error } = useSWR("/scraper/all", getter);
  const evData = data?.ev;
  const user: User | null = useContext(UserContext);
  const showBets = user ? user.dbuser.plan!="free" : false;

  return (
    <div className="page-offset-x py-8 bg-gray-900">
      {data ? 
      (
        evData.map((bet: EV) => (
          <div className=" drop-shadow-md rounded-md grid py-3 gap-6 grid-cols-1 2xl:grid-cols-2 mb-6">
            <EVLoader b={bet} key={bet.id} />
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
