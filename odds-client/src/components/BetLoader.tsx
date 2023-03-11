import { Bet } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import Modal from "./Modal";

interface props {
  b: Bet;
}

export default function BetLoader({ b }: props) {
  const [modal, setModal] = useState(false);
  function closeModal(): void {
    setModal(false);
  }
  return (
    <>
      <div className="bg-grey-600 rounded-xl grid grid-cols-3 grid-rows-3 px-3 h-48">
        <div className="col-span-3 grid grid-cols-3">
          <h1>Match Name</h1>
          <h1>Profit</h1>
          <h1>Books</h1>
        </div>
        <div className="col-span-3 grid grid-cols-3">
          <h3>{b.data.match_name}</h3>
          <p>{((1 - b.data.total_implied_odds) * 100).toFixed(2)}%</p>
          <div>
            {Object.keys(b.data.best_outcome_odds).map((key, index) => (
              <div className="col-span-3" key={index}>
                <span>{b.data.best_outcome_odds[key][0]} </span>
              </div>
            ))}
            <button onClick={() => setModal(true)}>
              Calculate Stake Amounts
            </button>
          </div>
        </div>
      </div>
      <Modal isVisible={modal} closeModal={closeModal} id={b.id} />
      <hr></hr>
    </>
  );
}
