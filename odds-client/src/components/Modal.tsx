import React, { useState, useContext } from "react";
import { createBet, spreadStake, hedgeStake } from "@/api";
import { Hedge, SpreadStake } from "@/types";
import { AlertContext } from "@/pages/_app";
import { Tabs } from "flowbite-react";
import SpreadOutcome from "./SpreadOutcome";
import HedgeOutcome from "./HedgeOutcome";

export default function Modal({
  isVisible,
  id,
  closeModal,
}: {
  isVisible: boolean;
  id: number;
  closeModal: () => void;
}) {
  const alertContext = useContext(AlertContext);
  const [stake, setStake] = useState(null);
  const [outcome, setOutcome] = useState<SpreadStake | Hedge | null>(null);
  const [calculator, setCalculator] = useState("Spread");

  function returnDropCSS(s: string) {
    if (s == calculator) {
      return "inline-block w-full p-4 text-gray-900 bg-gray-100 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white";
    } else {
      return "inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-600";
    }
  }

  async function getProfit(e: any) {
    try {
      setStake(e.target.value); // set stake variable to input value
      if (calculator == "Spread") {
        var data = await spreadStake(id, parseInt(e.target.value));
      } else {
        var data = await hedgeStake(id, parseInt(e.target.value));
      }

      // * var data = await hedgeStake(id, parseInt(e.target.value));  <-- This works however profit needs altering so that it's a mean of all outcome profits
      setOutcome(data);
    } catch (e) {
      alertContext?.setAlert({ msg: "Error calculating stake!", error: true });
    }
  }

  async function newBet(e: any) {
    e.preventDefault();
    try {
      var data = await createBet(id, stake);
      alertContext?.setAlert({ msg: "Bet created!", error: false });
    } catch (e) {
      console.error(e);
      alertContext?.setAlert({ msg: "Error creating bet!", error: true });
    }

    closeModal();
  }

  if (isVisible == false) return null;

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative w-full h-full max-w-2xl md:h-auto text-center">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add to bet tracker
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
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
            <li className="w-full">
              <a
                href="#"
                onClick={() => setCalculator("Spread")}
                aria-current="page"
                className={returnDropCSS("Spread")}
              >
                Spread
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                onClick={() => setCalculator("Hedge")}
                className={returnDropCSS("Hedge")}
              >
                Hedge
              </a>
            </li>
          </ul>
          <form action="" className="max-w-sm mx-auto p-4">
            <input
              type="number"
              value={stake}
              placeholder="0.00"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => getProfit(e)}
            />
            {calculator == "Spread" ? (
              <SpreadOutcome c={outcome} />
            ) : (
              <HedgeOutcome c={outcome} />
            )}
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
