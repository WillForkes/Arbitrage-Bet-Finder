import React, { useState, useContext } from "react";
import { simulateEVBet } from "@/api";
import { Hedge, SpreadStake } from "@/types";
import { AlertContext } from "@/pages/_app";
import { Tabs } from "flowbite-react";
import SpreadOutcome from "./SpreadOutcome";
import HedgeOutcome from "./HedgeOutcome";
import { Card} from "flowbite-react";

export default function SimulateModal({
  isVisible,
  id,
  closeModal,
}: {
  isVisible: boolean;
  id: number;
  closeModal: () => void;
}) {
  const alertContext = useContext(AlertContext);
  const [bets, setBets] = useState<number>(1000);
  const [simResults, setSimResults] = useState(null);

  async function simulateEV() {
    try {
        var data = await simulateEVBet(id, bets)

        setSimResults(data);
    } catch (e) {
        alertContext?.setAlert({ msg: "Error calculating stake!", error: true });
    }
  }

  if (isVisible == false) return null;

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative w-full h-full max-w-2xl md:h-auto text-center">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Simulate Positive EV Bet
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
          <div className="max-w-sm mx-auto p-4">
            <p>Total bet simulations</p>
            <input
              type="number"
              value={bets ? bets : 1000}
              placeholder="1000"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setBets(parseInt(e.target.value))}
            />
            
            <button
              onClick={() => {simulateEV()}}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Simulate
            </button>
          </div>

          {simResults ? (
            <Card>
            <h1 className="font-bold dark:text-primary-700">Simulation Results</h1>
            {/* bet simulation results  */}
            <dl className="flex items-center space-x-6">
                <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        Odds
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {simResults.betData.odds}
                    </dd>
                </div>
                <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        No Vig Odds
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {simResults.betData.noVigOdds.toFixed(2)}
                    </dd>
                </div>
                <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        Simulated bets
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {simResults.simulatedBets}
                    </dd>
                </div>
                <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        Bets won
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {simResults.betsWon}
                    </dd>
                </div>
                <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        Bets lost
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {simResults.betsLost}
                    </dd>
                </div>
                <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        Final ROI %
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {simResults.roiPercent}
                    </dd>
                </div>
                
            </dl>
            
          </Card>) : (null)
        }
          
        </div>
      </div>
    </div>
  );
}
