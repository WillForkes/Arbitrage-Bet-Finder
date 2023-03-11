import TrackedBetLoader from "@/components/TrackedBetLoader";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { TrackedBet } from '@/types';

export default function tracker() {
  const { data, error } = useSWR("/tracker/all", getter);
  return (
    <div>
      {data ? <h1>Loaded {data.length}</h1> : null}
      {data ? (
        data.map((trackedBet: TrackedBet) => <TrackedBetLoader tb={trackedBet} key={trackedBet.id} />)
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}
