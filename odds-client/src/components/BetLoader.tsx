import { Bet } from "@/types";
import { dateFormat } from "@/utils";
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
        <table >
            <tr>
                <td>Match</td>
                <td>Profit</td>
                <td>Books</td>
            </tr>
            <tr>
                <td>{b.data.match_name}</td>
                <td>{((1 - b.data.total_implied_odds) * 100).toFixed(2)}%</td>
                
                {Object.keys(b.data.best_outcome_odds).map((key, index) => (
                    <tr>
                        <td key={index}>{b.data.best_outcome_odds[key][0]}</td>
                    </tr>
                ))}
            </tr>
        </table>
        <div className="flex justify-center items-center col-start-1 row-span-1 col-span-3 mb-2 content-center">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setModal(true)}
            >
                Calculate Stake
            </button>
        </div>
        
{/*         
      <div className="bg-grey-800 px-.5 rounded-xl grid grid-cols-3 grid-rows-3 px-3 h-48">
        <div className="col-span-3 grid grid-cols-3">
          <h1>{dateFormat(b.data.match_start_time)}</h1>
          <h1>Profit</h1>
          <h1>Books</h1>
        </div>
        <div className="col-span-3 grid grid-cols-3">
          <h3>{b.data.match_name}</h3>
          <p>{((1 - b.data.total_implied_odds) * 100).toFixed(2)}%</p>
          <div>
            <div className="col-span-3 grid grid-cols-3">
              {Object.keys(b.data.best_outcome_odds).map((key, index) => (
                <span key={index}>{b.data.best_outcome_odds[key][0]} </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center col-start-1 row-span-1 col-span-3 mb-2 content-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setModal(true)}
          >
            Calculate Stake
          </button>
        </div>
      </div> */}
      <Modal isVisible={modal} closeModal={closeModal} id={b.id} />
    </>
  );
}
