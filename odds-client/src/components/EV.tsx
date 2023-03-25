import { Bet, EV } from "@/types";
import { dateFormat, filterRegion } from "@/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import EVModal from "./EVModal";
import { Table } from "flowbite-react";
import Logo from "/public/arbster.png";
import { Dropdown } from "flowbite-react";
import FreeModal from "./FreeModal";
import Pagination from "./Pagination";
import { getBookmakerLogo } from "../utils";
import {Badge} from "flowbite-react";

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
  const [regionFilter, setRegionFilter] = useState("UK");
  bets = filterRegion(regionFilter, bets);
  const [paginatedBets, setPaginatedBets] = useState<EV[]>(bets.slice(0, 10));

  function closeModal(): void {
    setModal(false);
  }

  function updateItems(page: number) {
    const start = (page - 1) * 10;
    const end = start + 10;
    setPaginatedBets(bets.slice(start, end));
  }

  function calculateRecommendedBetSize(bet: EV, totalBankroll: number): string {
    // kelly multiplier =  (win prob * net odds of bet) - (lose prob) / net odds of bet
    const winProb = bet.data.winProbability;
    const loseProb = 1 - winProb;
    const netOdds = bet.data.odds - 1;

    const kmultiplier = ((netOdds * winProb) - loseProb) / netOdds;

    let rec = (kmultiplier * totalBankroll).toFixed(2);
    // round to nearest integer
    rec = Math.round(Number(rec)).toString();
    return rec;
    //return (kmultiplier * 100).toFixed(0);
  }

  return (
    <>
      <EVModal
        isVisible={modal}
        recBetSize={modalRecBetSize}
        closeModal={closeModal}
        id={modalBetId}
      />
      <div className="px-4 mx-auto max-w-screen-2xl lg:px-4">
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="flex items-center flex-1 space-x-4">
              <h5>
                <span className="text-gray-500">Total bets:</span>
                <span className="dark:text-white">
                  {showBets || bets.length > 0
                    ? bets.length + " "
                    : " Login to view bets"}
                </span>
              </h5>
            </div>

            <Dropdown
              label="Region"
              className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <Dropdown.Item
                onClick={() => {
                  setRegionFilter("UK");
                }}
              >
                UK
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setRegionFilter("EU");
                }}
              >
                EU
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setRegionFilter("AU");
                }}
              >
                AU
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setRegionFilter("US");
                }}
              >
                US
              </Dropdown.Item>
            </Dropdown>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                <th scope="col" className="px-4 py-3">
                    Match Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Market
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Bet On
                  </th>
                  {/* <th scope="col" className="px-4 py-3">
                    League
                  </th> */}
                  {/* <th scope="col" className="px-4 py-3">
                    Win Odds
                  </th> */}
                  <th scope="col" className="px-4 py-3">
                    Expected Value
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Region
                  </th>
                  
                  <th scope="col" className="px-4 py-3">
                    Bookmakers
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Odds
                  </th>
                  <th scope="col" className="px-4 py-3">
                    No vig-odds
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Rec. Bet Size
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              {bets.length > 0 && !showBets ? <FreeModal /> : null}
              <tbody className={`divide ${showBets ? "" : "blur"}`}>
                {paginatedBets.map((bet) => (
                  <tr key={bet.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <th scope="row" className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {bet.data.winProbability > 0.6 ? (
                            <div className="inline-block w-4 h-4 mr-2 bg-green-700 rounded-full"></div>
                          ) : bet.data.winProbability > 0.4 ? (
                            <div className="inline-block w-4 h-4 mr-2 bg-blue-700 rounded-full"></div>
                          ) : (
                            <div className="inline-block w-4 h-4 mr-2 bg-red-700 rounded-full"></div>
                          )}

                        {showBets ? bet.data.match_name : "HOME TEAM v AWAY TEAM"}
                        <div className=" text-xs dark:text-primary-600">{bet.data.leagueFormatted}</div>
                    </th>
                    <th
                      scope="row"
                      className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {showBets ? bet.data.key : "MARKET"}
                    </th>
                    <th
                      scope="row"
                      className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {showBets ? bet.data.team : "TEAM NAME"}
                    </th>


                    {/* <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {showBets ? (
                        <div>
                          {bet.data.winProbability > 0.6 ? (
                            <div className="inline-block w-4 h-4 mr-2 bg-green-700 rounded-full"></div>
                          ) : bet.data.winProbability > 0.4 ? (
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
                    </td> */}

                    <th
                      scope="row"
                      className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                        +{showBets ? (bet.data.ev * 100).toFixed(2) : 0.0}%
                      </span>
                    </th>

                    <td className="px-4 py-2 text-white">
                      {showBets ? bet.data.region.toUpperCase() : "REGION"}
                    </td>

                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {showBets ? (
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={getBookmakerLogo(bet.data.bookmaker)}
                                alt="Bookmaker Logo"
                                className="rounded-md"
                                width={25}
                                height={25}
                              />
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
                              <Image
                                src={Logo}
                                alt="Bookmaker Logo"
                                width={20}
                                height={20}
                              />
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
                      {showBets
                        ? bet.data.odds
                        : "0"}
                    </td>

                    <td className="px-4 py-2">
                      {showBets
                        ? bet.data.noVigOdds.toFixed(2)
                        : "0.00"}
                    </td>

                    <td className="px-10 py-2" >
                        <Badge color="success">
                        $
                            {showBets
                            ? calculateRecommendedBetSize(bet, 200) + ".00"
                            : "0.00"}
                        </Badge> 
                    </td>

                    <td>
                      {showBets ? (
                        <div>
                          <button
                            onClick={() => {
                              setModalBetId(bet.id);
                              setModalRecBetSize(
                                calculateRecommendedBetSize(bet, 200)
                              );
                              setModal(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Add to tracker
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {}}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Calculate Stake
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={1}
            itemsPerPage={10}
            maxItems={bets.length}
            updateItems={updateItems}
          />
        </div>
      </div>
    </>
  );
}
