import { Bet } from "@/types";
import { dateFormat } from "@/utils";
import React, { useState, useContext } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { Table } from "flowbite-react";
import { Region } from '../types';
import Logo from "/public/arbster.png";
import { AlertContext } from "@/pages/_app";

interface props {
  bets: Bet[];
  showBets: boolean;
}

export default function BetLoader({ bets, showBets }: props) {
  const alertContext = useContext(AlertContext);
  const [modal, setModal] = useState(false);
  
  function closeModal(): void {
    setModal(false);
  }

  return (
    <>
        <div className="px-4 mx-auto max-w-screen-2xl lg:px-4">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                    <div className="flex items-center flex-1 space-x-4">
                        <h5>
                            <span className="text-gray-500">Total bets:</span>
                            <span className="dark:text-white"> {bets.length}</span>
                        </h5>
                        <h5>
                            <span className="text-gray-500">???:</span>
                            <span className="dark:text-white">???</span>
                        </h5>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Match Name</th>
                                <th scope="col" className="px-4 py-3">League</th>         
                                <th scope="col" className="px-4 py-3">Profit Percentage</th>
                                <th scope="col" className="px-4 py-3">Region</th>
                                <th scope="col" className="px-4 py-3">Bookmakers</th>
                                <th scope="col" className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bets.map((bet) => (
                                <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {bet.data.match_name}
                                    </th>
                                    
                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {bet.data.leagueFormatted}
                                    </th>

                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                                            {((1-bet.data.total_implied_odds) * 100).toFixed(2)}%
                                        </span>
                                    </th>

                                    <td className="px-4 py-2">
                                        {bet.data.region}
                                    </td>
                                    
                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            { showBets ? Object.keys(bet.data.best_outcome_odds).map((key, index) => (
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="relative">
                                                            <Image src={Logo} alt="Bookmaker Logo" width={20} height={20} />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {bet.data.best_outcome_odds[key][0]}
                                                        </p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p>Nothing here</p>
                                            )}
                                    </td>

                                    <td>
                                        <button onClick={() => {setModal(true)}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                            Calculate Stake
                                        </button>
                                        <Modal isVisible={modal} closeModal={closeModal} id={bet.id} />

                                    </td>
                                </tr>
                            ))}
                    
                        </tbody>
                    </table>
                </div>
                <nav className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0" aria-label="Table navigation">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Showing
                        <span className="font-semibold text-gray-900 dark:text-white">1-10</span>
                        of
                        <span className="font-semibold text-gray-900 dark:text-white">1000</span>
                    </span>
                    <ul className="inline-flex items-stretch -space-x-px">
                        <li>
                            <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Previous</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"  />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                        </li>
                        <li>
                            <a href="#" aria-current="page" className="z-10 flex items-center justify-center px-3 py-2 text-sm leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Next</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"  />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </>
  );
}
