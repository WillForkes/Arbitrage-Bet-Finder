import React, { useState } from "react";

const Calculator = () => {
  const [months, setMonths] = useState(0);
  const [avgProfitPerBet, setAvgProfitPerBet] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const [finalProfitPercentage, setFinalProfitPercentage] = useState("");

  const calculateProfitPercentage = () => {
    const interestRate = avgProfitPerBet * 0.01;
    const exponential = Math.exp(interestRate * (30 * months));
    var total = exponential * principal;
    var percent = ((total - principal) / principal) * 100;
    setFinalProfitPercentage(percent.toFixed(2));
  };

  return (
    <div className="bg-gray-800 p-8 rounded-md shadow-lg w-75">
      <h1 className="text-3xl mb-4">Profit Percentage Calculator</h1>
      <div className="mb-4">
        <label htmlFor="months" className="block mb-2">
          Months
        </label>
        <input
          type="number"
          id="months"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={months}
          onChange={(e) => setMonths(parseInt(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="avgProfitPerBet" className="block mb-2">
          Average profit per bet:
        </label>
        <input
          type="number"
          id="avgProfitPerBet"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={avgProfitPerBet}
          onChange={(e) => setAvgProfitPerBet(parseInt(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="Principal" className="block mb-2">
          Principal:
        </label>
        <input
          type="number"
          id="Principal"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={principal}
          onChange={(e) => setPrincipal(parseInt(e.target.value))}
        />
      </div>
      <button
        className="bg-primary text-white py-2 px-4 rounded-md"
        onClick={calculateProfitPercentage}
      >
        Calculate
      </button>
      {finalProfitPercentage && (
        <div className="mt-4">
          <p className="text-lg">
            Final profit percentage:{" "}
            <span className="font-bold">
              {finalProfitPercentage}% profit in {months} month(s)
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
