import { Bet, EV } from "@/types";
import { dateFormat } from "@/utils";
import React, { useState } from "react";
import Image from "next/image";
import EVModal from "./EVModal";
import { Table } from "flowbite-react";
import Logo from "/public/arbster.png";

// example
// {"match_id":"06f491453cb35e153d61c67257f3cb3b","match_name":"Bayern Munich v. Borussia Dortmund","match_start_time":1680366600,"hours_to_start":267.19723500000106,"league":"soccer_germany_bundesliga","key":"h2h","bookmaker":"Betsson","winProbability":0.18587360594795543,"odds":6,"ev":"0.115","region":"eu"}

interface props {
  bets: EV[];
  showBets: boolean;
}

export default function EVLoader({ bets, showBets }: props) {
  const [modal, setModal] = useState(false);
  const [modalBetId, setModalBetId] = useState(0);
  const [modalRecBetSize, setModalRecBetSize] = useState(0);

  function closeModal(): void {
    setModal(false);
  }

  function calculateRecommendedBetSize(bet: EV, totalBankroll : number) : number {
    // kelly multiplier = (ev - probability of losing) / (decimal odds - 1)
    const kmultiplier = ( bet.data.ev - (1 - bet.data.winProbability) ) / ( (1 / bet.data.odds) - 1)
    let rec = (kmultiplier * totalBankroll).toFixed(2);
    // round to nearest integer
    rec = Math.round(Number(rec)).toString();
    return rec;
  }

  return (
    <>
        <EVModal isVisible={modal} recBetSize={modalRecBetSize} closeModal={closeModal} id={modalBetId} />    
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
                                <th scope="col" className="px-4 py-3">Bet On</th>    
                                <th scope="col" className="px-4 py-3">League</th>      
                                <th scope="col" className="px-4 py-3">Win Odds</th>
                                <th scope="col" className="px-4 py-3">Profit Percentage</th>
                                <th scope="col" className="px-4 py-3">Region</th>
                                <th scope="col" className="px-4 py-3">Bookmakers</th>
                                <th scope="col" className="px-4 py-3">Rec. Bet Size</th>
                                <th scope="col" className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide ${showBets ? "" : "blur"}`}>
                            {bets.map((bet) => (
                                <tr key={bet.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {showBets ? bet.data.match_name : "HOME TEAM v AWAY TEAM"}
                                    </th>
                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {showBets ? bet.data.team : "TEAM NAME"}
                                    </th>
                                    
                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {showBets ? bet.data.leagueFormatted : "SPORT LEAGUE"}
                                    </th>

                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { showBets ? (
                                            <div>
                                                {bet.data.winProbability > 0.6 ? (
                                                    <div className="inline-block w-4 h-4 mr-2 bg-green-700 rounded-full"></div>
                                                ) : (bet.data.winProbability > 0.4) ? (
                                                    <div className="inline-block w-4 h-4 mr-2 bg-blue-700 rounded-full"></div>
                                                ) : (
                                                    <div className="inline-block w-4 h-4 mr-2 bg-red-700 rounded-full"></div>
                                                )}

                                                {(bet.data.winProbability * 100).toFixed(2)}%
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="inline-block w-4 h-4 mr-2 bg-red-700 rounded-full"></div>
                                                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                                                    0.00%
                                                </span>
                                            </div>
                                        )}
                                    </td>

                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                                            {showBets ? (bet.data.ev * 100).toFixed(2) : 0.00}%
                                        </span>
                                    </th>

                                    <td className="px-4 py-2">
                                        {showBets ? bet.data.region.toUpperCase() : "REGION"}
                                    </td>
                                    
                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        { showBets ? (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <Image src={Logo} alt="Bookmaker Logo" width={20} height={20} />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {bet.data.bookmaker}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <Image src={Logo} alt="Bookmaker Logo" width={20} height={20} />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        BOOKMAKER1
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-2">
                                        ${showBets ? calculateRecommendedBetSize(bet, 200) : "0.00"}
                                    </td>
                                    
                                    <td>
                                        { showBets ? (
                                            <div>
                                                <button onClick={() => {
                                                    setModalBetId(bet.id)
                                                    setModalRecBetSize(calculateRecommendedBetSize(bet, 200))
                                                    setModal(true)
                                                    console.log(bet.id)
                                                    console.log(modalRecBetSize)
                                                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                    Add to tracker
                                                </button>
                                            </div> 
                                        ) : (
                                            <button onClick={() => {}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                Calculate Stake
                                            </button>
                                        )
                                        }
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
