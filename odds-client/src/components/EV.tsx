import { Bet, EV, User } from "@/types";
import { dateFormat, filterRegion } from "@/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import EVModal from "./EVModal";
import { Button, Table, TextInput } from "flowbite-react";
import Logo from "/public/arbster.png";
import { Dropdown } from "flowbite-react";
import FreeModal from "./FreeModal";
import Pagination from "./Pagination";
import { getBookmakerLogo } from "../utils";
import { Tooltip, Badge, Spinner } from "flowbite-react";
import Link from "next/link";

// example
// {"match_id":"06f491453cb35e153d61c67257f3cb3b","match_name":"Bayern Munich v. Borussia Dortmund","match_start_time":1680366600,"hours_to_start":267.19723500000106,"league":"soccer_germany_bundesliga","key":"h2h","bookmaker":"Betsson","winProbability":0.18587360594795543,"odds":6,"ev":"0.115","region":"eu"}

interface props {
  bets: EV[];
  showBets: boolean;
  user: User | null;
}

export default function EVLoader({ bets, showBets, user }: props) {
  const [modal, setModal] = useState(false);
  const [pricing, setPricing] = useState(bets.length > 0 && !showBets);
  const [modalBetId, setModalBetId] = useState(0);
  const [modalRecBetSize, setModalRecBetSize] = useState(0);
  const [regionFilter, setRegionFilter] = useState("UK");
  var b: any = filterRegion(regionFilter, bets, user ? true : false);
  const [paginatedBets, setPaginatedBets] = useState<EV[]>(b.slice(0, 10));
  const [bankroll, setBankroll] = useState(0);
  const [matchSearch, setMatchSearch] = useState("");

  function searchBetsByMatch(e: any) {
    if (user) {
      setMatchSearch(e);
      if (e == "") {
        setPaginatedBets(bets);
        return;
      }

      setPaginatedBets(
        b.filter((bet: any) =>
          bet.data.match_name.toLowerCase().includes(e.toLowerCase())
        )
      );
    }
  }

  function closeModal(): void {
    setModal(false);
  }

  function closePricing(): void {
    setPricing(false);
  }

  function updateItems(page: number) {
    const start = (page - 1) * 10;
    const end = start + 10;
    setPaginatedBets(b.slice(start, end));
  }

  function updateRegion(region: string) {
    setRegionFilter(region);
    b = filterRegion(region, bets, user ? true : false);
    setPaginatedBets(b.slice(0, 10));
  }

  function calculateRecommendedBetSize(bet: EV, totalBankroll: number): string {
    // kelly multiplier =  (win prob * net odds of bet) - (lose prob) / net odds of bet
    const winProb = bet.data.winProbability;
    const loseProb = 1 - winProb;
    const netOdds = bet.data.odds - 1;

    const kmultiplier = (netOdds * winProb - loseProb) / netOdds;

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
                {!showBets ? (
                  <span className="dark:text-white">Paid Tier Only</span>
                ) : null}
              </h5>
              <TextInput
                className="w-full lg:w-3/4 md:w-7/8 sm:w-3/4"
                type="text"
                placeholder="Search Match"
                onChange={(e) => searchBetsByMatch(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-start"></div>
            <div className="flex items-center justify-start">
              <TextInput
                className="w-full lg:w-3/4 md:w-7/8 sm:w-3/4"
                type="number"
                placeholder="Total Bankroll"
                onChange={(e) => setBankroll(parseInt(e.target.value))}
              />
            </div>

            <Dropdown
              label="Region"
              className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <Dropdown.Item
                onClick={() => {
                  updateRegion("UK");
                }}
              >
                UK
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  updateRegion("EU");
                }}
              >
                EU
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  updateRegion("AU");
                }}
              >
                AU
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  updateRegion("US");
                }}
              >
                US
              </Dropdown.Item>
            </Dropdown>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    MATCH NAME
                  </th>
                  <th scope="col" className="px-4 py-3">
                    MARKET
                  </th>
                  <th scope="col" className="px-4 py-3">
                    BET ON
                  </th>
                  <th scope="col" className="px-4 py-3">
                    EXPECTED VALUE
                  </th>
                  <th scope="col" className="px-4 py-3">
                    BOOKMAKERS
                  </th>
                  <th scope="col" className="px-4 py-3">
                    ODDS
                  </th>
                  <th scope="col" className="px-4 py-3">
                    NO-VIG ODDS
                    <Tooltip
                      animation="duration-300"
                      content="Sports bettors use no-vig odds to determine what the sportsbooks think the true probability of an outcome is."
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4 mt-1 ml-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                        ></path>
                      </svg>
                    </Tooltip>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    REC. BET SIZE
                    <Tooltip
                      animation="duration-300"
                      content="This is calculated using the Kelly Criterion based from your total bankroll and the win probabilty of the match. "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4 mt-1 ml-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                        ></path>
                      </svg>
                    </Tooltip>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              {pricing ? <FreeModal closeModal={closePricing} /> : null}
              <tbody className={`divide ${showBets ? "" : "blur"}`}>
                {paginatedBets.map((bet) => (
                  <tr
                    key={bet.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Tooltip
                      content={`Win probability: ${
                        showBets
                          ? (bet.data.winProbability * 100).toFixed(2)
                          : "?.??%"
                      }%`}
                    >
                      <th
                        scope="row"
                        className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {bet.data?.winProbability > 0.6 ? (
                          <div className="inline-block w-4 h-4 mr-2 bg-green-700 rounded-full"></div>
                        ) : bet.data?.winProbability > 0.35 ? (
                          <div className="inline-block w-4 h-4 mr-2 bg-blue-700 rounded-full"></div>
                        ) : bet.data?.winProbability < 0.35 ? (
                          <div className="inline-block w-4 h-4 mr-2 bg-red-700 rounded-full"></div>
                        ) : (
                          <div className="inline-block w-4 h-4 mr-2 bg-green-700 rounded-full"></div>
                        )}

                        <Link href={`/bet/${bet.id}`}>
                            {showBets
                            ? bet.data.match_name
                            : "HOME TEAM v AWAY TEAM"}{" "}
                            - {showBets ? bet.data.region.toUpperCase() : "REGION"}
                            <div className=" text-xs dark:text-primary-600">
                            {showBets
                                ? bet.data.leagueFormatted
                                : "LEAGUE_FORMATTED"}
                            </div>
                        </Link>


                      </th>
                    </Tooltip>
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

                    <th
                      scope="row"
                      className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                        +{showBets ? (bet.data.ev * 100).toFixed(2) : 0.0}%
                      </span>
                    </th>

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
                      {showBets ? bet.data.odds : "0"}
                    </td>

                    <td className="px-4 py-2">
                      {showBets ? bet.data.noVigOdds.toFixed(2) : "0.00"}
                    </td>

                    <td className="px-10 py-2 pl-2">
                      {showBets && bankroll != 0 && !Number.isNaN(bankroll) ? (
                        <Badge color="success">
                          ${calculateRecommendedBetSize(bet, bankroll) + ".00"}
                        </Badge>
                      ) : (
                        <Badge color="warning">Input Bankroll</Badge>
                      )}
                    </td>

                    <td>
                      {showBets ? (
                        <div>
                          <button
                            onClick={() => {
                              setModalBetId(bet.id);
                              setModalRecBetSize(
                                parseInt(
                                  calculateRecommendedBetSize(bet, bankroll)
                                )
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
            {paginatedBets.length === 0 ? (
                <div className="mx-auto max-w-md text-center py-8">
                    <h2 className="text-xl font-bold mb-6 lg:text-2xl dark:text-white">
                        We couldn&apos;t find any bets in this region. Please consider whitelisting more bookmakers or try again soon.
                    </h2>
                    <Spinner aria-label="Default status example" />
                </div>
            ) : (null)}
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
