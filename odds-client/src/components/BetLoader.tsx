import { Bet } from "@/types";
import { dateFormat } from "@/utils";
import React, { useState, useContext } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { Dropdown } from "flowbite-react";
import { Region } from '../types';
import Logo from "/public/arbster.png";
import { AlertContext } from "@/pages/_app";

// example:
// {"match_id":"d3015bfea46b4b86f2407a6845885393","match_name":"St. Louis Cardinals v. Washington Nationals","match_start_time":1679418300,"hours_to_start":3.7805919444561003,"league":"baseball_mlb_preseason","key":"h2h","best_outcome_odds":{"St. Louis Cardinals":["Pinnacle",1.69],"Washington Nationals":["MyBookie.ag",2.55]},"total_implied_odds":0.9839,"region":"eu"}

interface props {
  bets: Bet[];
  showBets: boolean;
}

export default function BetLoader({ bets, showBets }: props) {
  const alertContext = useContext(AlertContext);
  const [modal, setModal] = useState(false);
  const [modalBetId, setModalBetId] = useState(0);
  const [regionFilter, setRegionFilter] = useState('UK');


  function closeModal(): void {
    setModal(false);
  }

  return (
    <>
        <div className="px-4 mx-auto max-w-screen-2xl lg:px-4">
            <Modal isVisible={modal} closeModal={closeModal} id={modalBetId} />    
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                    <div className="flex items-center flex-1 space-x-4">
                        <h5>
                            <span className="text-gray-500">Total bets:</span>
                            <span className="dark:text-white">{showBets ? bets.length : " Login to view bets"}</span>
                        </h5>
                    </div>
                    <Dropdown
                    label="Region"
                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                    <Dropdown.Item onClick={() => {setRegionFilter("UK")}}>
                        UK
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => {setRegionFilter("EU")}}>
                        EU
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => {setRegionFilter("AU")}}>
                        AU
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => {setRegionFilter("US")}}>
                        US
                    </Dropdown.Item>
                    </Dropdown>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Match Name</th>
                                <th scope="col" className="px-4 py-3">Market</th>
                                    
                                <th scope="col" className="px-4 py-3">League</th>
                                <th scope="col" className="px-4 py-3">Profit Percentage</th>
                                <th scope="col" className="px-4 py-3">Region</th>
                                <th scope="col" className="px-4 py-3">Bookmakers</th>
                                <th scope="col" className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide ${showBets ? "" : "blur"}`}>
                            {bets.map((bet) => (
                                <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {showBets ? bet.data.match_name : "HOME TEAM v AWAY TEAM"}
                                    </th>

                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {showBets ? bet.data.key.toUpperCase() : "MARKET"}
                                    </th>
                                    
                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {showBets ? bet.data.leagueFormatted : "SPORT LEAGUE"}
                                    </th>

                                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                                            {showBets ? ((1-bet.data.total_implied_odds) * 100).toFixed(2) : 0.00}%
                                        </span>
                                    </th>

                                    <td className="px-4 py-2">
                                        {showBets ? bet.data.region.toUpperCase() : "REGION"}
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
                                            <div>
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
                                                <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <Image src={Logo} alt="Bookmaker Logo" width={20} height={20} />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        BOOKMAKER2
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </td>

                                    <td>
                                        { showBets ? (
                                            <div>
                                                <button onClick={() => {
                                                    setModal(true)
                                                    setModalBetId(bet.id)
                                                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                    Calculate Stake
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
