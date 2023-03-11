import { TrackedBet } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import Modal from "./Modal";

interface props {
  tb: TrackedBet;
}

export default function BetLoader({ tb }: props) {
  console.log(tb)
  return (
    <>
      <div className="match">
        <h3>Bet ID: {tb.betId}</h3>
        <p>${tb.totalStake}</p>
        <p>{tb.profitPercentage * 100}%</p>
        <p>Risk: {(tb.profitPercentage * 100 > 3) ? "High" : "Low"}</p>
      </div>
      <hr></hr>
    </>
  );
}
