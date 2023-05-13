import React, { useState, useContext, useEffect } from "react";
import { createBet, spreadStake, hedgeStake } from "@/api";
import { Hedge, SpreadStake } from "@/types";
import { AlertContext } from "@/pages/_app";
import { Spinner, Tabs } from "flowbite-react";
import SpreadOutcome from "./SpreadOutcome";
import HedgeOutcome from "./HedgeOutcome";

export default function CancelModal({
  isVisible,
  closeModal,
  cancelSub,
  cancelDealActivated,
  activateDeal
}: {
  isVisible: boolean;
  closeModal: () => void;
  cancelSub: () => void;
  cancelDealActivated: boolean;
  activateDeal: () => void;
}) {
  const alertContext = useContext(AlertContext);


  if (isVisible == false) return null;

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50">
    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <button onClick={() => {closeModal()}} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
            </button>
            <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to cancel your subscription?</p>
            {!cancelDealActivated ? (
                <p className="mb-4 text-gray-500 font-bold dark:text-gray-300">We&apos;d like to offer you a one time offer of 50% off your next renewal!</p>
            ) : null}
            
            <div className="flex justify-center items-center space-x-4">
                <button
                onClick={() => {
                    if(cancelDealActivated) {
                        closeModal();
                    } else {
                        activateDeal();
                        closeModal();
                    }
                }} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium rounded-lg border dark:bg-green-700 dark:text-white dark:border-green-600 dark:hover:text-white dark:hover:bg-green-400 dark:focus:ring-gray-600">
                {cancelDealActivated ? (
                    <>No, I changed my mind</>
                ) : (
                    <>I want 50% off!</>
                )}
                </button>
                <button onClick={() => {
                    cancelSub();
                    closeModal();
                }} className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                    Yes, I&apos;m sure
                </button>
            </div>
        </div>
    </div>
    </div>
  );
}
