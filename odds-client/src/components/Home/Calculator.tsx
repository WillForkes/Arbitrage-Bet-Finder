import { Badge, Card } from "flowbite-react";
import React, { useState } from "react";
import Link from "next/link";
import { Spinner } from "flowbite-react";
const Calculator = () => {
  const [months, setMonths] = useState(3);
  const [avgProfitPerBet, setAvgProfitPerBet] = useState(4);
  const [principal, setPrincipal] = useState(50);
  const [perDay, setperDay] = useState(2);
  const [finalProfitPercentage, setFinalProfitPercentage] = useState(0);
  const [finalProfit, setfinalProfit] = useState(0);

  const calculateProfitPercentage = () => {
    const totalProfitPercentage =
      (1 + avgProfitPerBet / 100) ^ (perDay * 30 * months - 1);
    const totalProfit = totalProfitPercentage * principal;
    setFinalProfitPercentage(totalProfitPercentage);
    setfinalProfit(totalProfit);
  };

  return (
    <section className="bg-white dark:bg-gray-900 pb-4">
      <div className="flex flex-wrap items-start justify-between pl-10">
        <div className="bg-gray-800 p-8 rounded-md shadow-lg lg:w-1/2 md:w-full mr-4 md:mb-4">
          <span className="font-bold tracking-wider uppercase dark:text-primary-700">
            Calculate your potential profits
          </span>
          <h2 className="mb-2 text-xl font-bold lg:text-2xl dark:text-white">
            Profit Calculator
          </h2>
          <div className="mb-4">
            <label htmlFor="months" className="block mb-2">
              Time period (months)
            </label>
            <input
              type="number"
              id="months"
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:border-primary-700 dark:focus:ring-primary-700"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="avgProfitPerBet" className="block mb-2">
              Average ROI per bet (%):
            </label>
            <input
              type="number"
              id="avgProfitPerBet"
              className=" shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:border-primary-700 dark:focus:ring-primary-700"
              value={avgProfitPerBet}
              onChange={(e) => setAvgProfitPerBet(parseInt(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Principal" className="block mb-2">
              Amount per bet ($):
            </label>
            <input
              type="number"
              id="Principal"
              className=" shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:border-primary-700 dark:focus:ring-primary-700"
              value={principal}
              onChange={(e) => setPrincipal(parseInt(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Principal" className="block mb-2">
              Bets taken per day:
            </label>
            <input
              type="number"
              id="Principal"
              className=" shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:border-primary-700 dark:focus:ring-primary-700"
              value={perDay}
              onChange={(e) => setperDay(parseInt(e.target.value))}
            />
          </div>

          <button
            onClick={calculateProfitPercentage}
            className="bg-main-600 hover:bg-main-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-primary-900"
          >
            Calculate
          </button>
        </div>

        <div className="bg-gray-800 p-8 rounded-md shadow-lg lg:w-2/5 md:w-full mr-8 pl-10">
            <span className="font-bold tracking-wider uppercase dark:text-primary-700">
            Calculation Results
            </span>
            <h2 className="mb-2 text-xl font-bold lg:text-2xl dark:text-white">
            Profit Calculator
            </h2>
            {finalProfitPercentage ? (
                <div>
                <div className="mt-4">
                    <span className="flex mb-4">Profit percentage:<div className="ml-4 mt-1"><Badge color="green">{finalProfitPercentage}%</Badge></div></span>
                    <span className="flex mb-4">Total profit (USD):<div className="ml-4 mt-1"><Badge color="green">${finalProfit}</Badge></div></span>
                    <span className="flex mb-4">Timespan:<div className="ml-4 mt-1"><Badge>{perDay} Month(s)</Badge></div></span>
                </div>

                <Link href="/#pricing"
                className="float-left mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                >
                What are you waiting for? Start your free trial now!
                </Link>
                </div>
            ) : (
                <div className="mx-auto text-center mt-8 lg:mt-12">
                    <h2 className="text-md font-bold dark:text-white">
                        Waiting for calculation...
                    </h2>

                    <Spinner aria-label="Default status example" />
                </div>
            )}

            
        </div>
      </div>
    </section>
  );
};

export default Calculator;
