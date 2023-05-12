import { Badge, Card } from "flowbite-react";
import React, { useState } from "react";

const Calculator = () => {
  const [months, setMonths] = useState(3);
  const [avgProfitPerBet, setAvgProfitPerBet] = useState(4);
  const [principal, setPrincipal] = useState(50);
  const [perDay, setperDay] = useState(2);
  const [finalProfitPercentage, setFinalProfitPercentage] = useState(null);
  const [finalProfit, setfinalProfit] = useState(null);

  const calculateProfitPercentage = () => {
    const totalProfitPercentage = (1 + (avgProfitPerBet / 100))^(perDay * 30 * months) -1;
    const totalProfit = totalProfitPercentage * principal;
    setFinalProfitPercentage(totalProfitPercentage);
    setfinalProfit(totalProfit);
  };

  return (
    <section className="bg-white dark:bg-gray-900 pb-4">
    <div className="flex items-start justify-between pl-10">
        <div className="bg-gray-800 p-8 rounded-md shadow-lg w-1/3">
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
            {finalProfitPercentage && (
            <div className="mt-4">
                <Badge color="green" className="mr-2">
                <p className="text-lg">
                    <span className="font-bold">
                    ({finalProfitPercentage}%){" "}
                    </span>
                    <span className="font-bold">
                    +${finalProfit}{" "}
                    </span>
                    <span>Profit in {months} month(s)</span>
                </p>
                </Badge>
            </div>
            )}
        </div>
        
        <div className="bg-gray-800 p-8 rounded-md shadow-lg w-1/2 mr-8 pl-10">
            <p>Something here</p>
        </div>
    </div>
    </section>
  );
};

export default Calculator;
