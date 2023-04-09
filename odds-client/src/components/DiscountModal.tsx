import React, { useState, useContext } from "react";
import { Hedge, SpreadStake } from "@/types";
import { AlertContext } from "@/pages/_app";
import { Badge } from "flowbite-react";
import SpreadOutcome from "./SpreadOutcome";
import HedgeOutcome from "./HedgeOutcome";
import { HiClock, HiCheck, HiCurrencyPound, HiX } from "react-icons/hi";

export default function DiscountModal({
  isVisible,
  plan,
  trial,
  closeModal,
  createCheckoutSession,
}: {
  isVisible: boolean;
  plan: string;
  trial: boolean;
  closeModal: () => void;
  createCheckoutSession: (plan: string, discount: string | null) => void;
}) {
  const [discountCode, setdiscountCode] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<SpreadStake | Hedge | null>(null);
  const [calculator, setCalculator] = useState("Spread");

  if (isVisible == false) return null;

  if(trial) {
    createCheckoutSession(plan, null);
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative w-full h-full max-w-2xl md:h-auto text-center">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Apply Discount Code?
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
        
        <div className="flex flex-col items-center justify-center">
            <div className="flex mt-4 mx-auto flex-wrap gap-2">
                <Badge icon={HiCheck}>
                    {plan.toUpperCase()} Plan
                </Badge>
            </div>
        </div>
          <form action="" className="max-w-sm mx-auto p-4">
            <input
              type="text"
              value={discountCode ? discountCode : ""}
              placeholder="CODE10 (not required)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setdiscountCode(e.target.value)}
            />
            <button
              onClick={(e) => createCheckoutSession(plan, discountCode)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            >
              Goto Checkout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
