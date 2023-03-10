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
      <div className="match">
        <h3>{b.data.match_name}</h3>
        <p>{((1 - b.data.total_implied_odds) * 100).toFixed(2)}%</p>
        <div>
          {Object.keys(b.data.best_outcome_odds).map((key, index) => (
            <div className="outcome" key={index}>
              <span>{b.data.best_outcome_odds[key][0]} </span>
              <b>{b.data.best_outcome_odds[key][1]}</b>
            </div>
          ))}
          <button onClick={() => setModal(true)}>Calculate Stake Amounts</button>
        </div>
      </div>
      <Modal isVisible={modal} closeModal={closeModal} id={b.id} />
      <hr></hr>
    </>
  );
}
