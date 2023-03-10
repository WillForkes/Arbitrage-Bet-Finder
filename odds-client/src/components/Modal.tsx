import React, { useState } from "react";
import { createBet, spreadStake, hedgeStake } from "@/api";
import { SpreadStake } from "@/types";

export default function Modal({
  isVisible,
  id,
  closeModal,
}: {
  isVisible: boolean;
  id: number;
  closeModal: () => void;
}) {
  const [stake, setStake] = useState(0);
  const [outcome, setOutcome] = useState<SpreadStake | null>(null);

  async function getProfit(e: any) {
    try {
      setStake(e.target.value); // set stake variable to input value
      var data = await spreadStake(id, parseInt(e.target.value));
      // * var data = await hedgeStake(id, parseInt(e.target.value));  <-- This works however profit needs altering so that it's a mean of all outcome profits
      setOutcome(data);
    } catch (e) {
      console.log(e);
    }
  }

  async function newBet(e: any) {
    e.preventDefault();
    try {
      var data = await createBet(id, stake);
      console.log("SUCCESS", data);
    } catch (e) {
      console.error(e);
    }
  }

  if (isVisible == false) return null;
  
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative w-full h-full max-w-2xl md:h-auto text-center">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add a bet
            </h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form action="">
            <input
              type="number"
              value={stake}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => getProfit(e)}
            />
            <p>Profit ${outcome?.profit}</p>
            {outcome?.outcomes.map((outcome) => (
              <p>
                {outcome.outcome} wins: ${outcome.stake} on {outcome.book}
              </p>
            ))}
            <button
              onClick={(e) => newBet(e)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Bet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
