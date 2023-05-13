import { Bet, Plan, User } from "@/types";
import { dateFormat, filterRegion } from "@/utils";
import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { Dropdown, TextInput, Toast } from "flowbite-react";
import Logo from "/public/arbster.png";
import { AlertContext, UserContext } from "@/pages/_app";
import { getBookmakerLogo } from "@/utils";
import FreeModal from "./FreeModal";
import Link from "next/link";
import { Tooltip, Spinner, Badge } from "flowbite-react";
import OverlayImage from "../../public/freeoverlay.png";

// example:
// {"match_id":"d3015bfea46b4b86f2407a6845885393","match_name":"St. Louis Cardinals v. Washington Nationals","match_start_time":1679418300,"hours_to_start":3.7805919444561003,"league":"baseball_mlb_preseason","key":"h2h","best_outcome_odds":{"St. Louis Cardinals":["Pinnacle",1.69],"Washington Nationals":["MyBookie.ag",2.55]},"total_implied_odds":0.9839,"region":"eu"}

interface props {
  bets: Bet[];
  showBets: boolean;
}

export default function BetLoader({ bets, showBets }: props) {
  const alertContext = useContext(AlertContext);
  const ucontext: { user: User | null; auth: boolean | null } = useContext(UserContext);
  const user = ucontext.user;

  const [modal, setModal] = useState(false);
  const [modalBetId, setModalBetId] = useState(0);
  const [regionFilter, setRegionFilter] = useState(
    user ? user.dbuser.region : "UK"
  );

  const [paginatedBets, setPaginatedBets] = useState<Bet[]>(
    filterRegion(regionFilter, bets, user ? true : false) as Bet[]
  );

  function closeModal(): void {
    setModal(false);
  }

  function updateRegion(region: string) {
    setRegionFilter(region); // ui
    setPaginatedBets(filterRegion(region, bets, user ? true : false) as Bet[]); // bets with region filter
  }


  function searchBetsByMatch(e: any) {
    if (user) {
      if (e != "" || e != null) {
        setPaginatedBets(
          bets.filter((bet) =>
            bet.data.match_name.toLowerCase().includes(e.toLowerCase())
          )
        );
      }
    }
  }

  const exchanges = [
    "betfair",
    "matchbook",
    "smarkets"
  ];

  return (
    <>
      <div className="px-4 mx-auto max-w-screen-2xl lg:px-4">
        <Modal isVisible={modal} closeModal={closeModal} id={modalBetId} />
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="flex items-center flex-1 space-x-4">
              {!showBets ? (
                <span className="dark:text-white">Paid Tier Only</span>
              ) : null}

              <TextInput
                className="w-full lg:w-1/2 md:w-7/8 sm:w-3/4"
                type="text"
                placeholder="Search Match"
                onChange={(e) => searchBetsByMatch(e.target.value)}
              />
              <Toast className="dark:bg-gray-400">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                  <svg
                    fill="#32a852"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
                  </svg>
                </div>
                <div className="ml-3 text-white text-sm font-normal">
                  Update whitelisted bookmakers{" "}
                  <Link className="text-primary-700" href="/profile">
                    here
                  </Link>
                </div>
                <Toast.Toggle />
              </Toast>
            </div>
            <Dropdown
              label={regionFilter}
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
          {/* {pricing ? <FreeModal closeModal={closePricing} /> : null} */}
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
                    League
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Profit Percentage
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Region
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Bookmakers
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide ${showBets ? "" : "blur"}`}>
                {paginatedBets.map((bet) => (
                  <tr
                    key={bet.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <th
                      scope="row"
                      className="items-center px-4 py-8 font-medium text-gray-900 whitespace-nowrap dark:text-white underline hover:dark:text-primary-700"
                    >
                      <Tooltip
                        animation="duration-300"
                        content="Click here to view the the details of this bet"
                      >
                        <div className="flex mx-auto flex-wrap gap-2">
                            {bet.data?.live == true ? (
                                <div>
                                    <Badge>IN PLAY</Badge>
                                </div>
                            ) : null}

                            {exchanges.map((ex) => (
                                <div key={ex}>
                                    {JSON.stringify(bet.data?.best_outcome_odds)?.toLowerCase().includes(ex) ? (
                                        <Badge className="flex" color="purple">USES EXCHANGE(s)</Badge>
                                    ) : null}
                                </div>
                            ))}
                        </div>
         
                            

                        <Link href={`/bet/${bet.id}`}>
                          {showBets
                            ? bet.data?.match_name
                            : "HOME TEAM v AWAY TEAM"}
                        </Link>
                      </Tooltip>
                    </th>

                    <th
                      scope="row"
                      className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {showBets ? bet.data.key.toUpperCase() : "MARKET"}
                    </th>

                    <th
                      scope="row"
                      className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {showBets ? bet.data.leagueFormatted : "SPORT LEAGUE"}
                    </th>

                    <th
                      scope="row"
                      className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                        {showBets
                          ? (
                              (1 / bet.data.total_implied_odds - 1) *
                              100
                            ).toFixed(2)
                          : 0.0}
                        %
                      </span>
                    </th>

                    <td className="px-4 py-2">
                      {showBets ? bet.data.region.toUpperCase() : "REGION"}
                    </td>

                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {showBets ? (
                        Object.keys(bet.data.best_outcome_odds).map(
                          (key, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div className="flex-shrink-0">
                                <div className="relative py-1">
                                  <img
                                    className="rounded-md"
                                    src={getBookmakerLogo(
                                      bet.data.best_outcome_odds[key][0]
                                    )}
                                    alt="Bookmaker Logo"
                                    width={25}
                                    height={25}
                                  />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {bet.data.best_outcome_odds[key][0]} -{" "}
                                  {bet.data.best_outcome_odds[key][1]}
                                </p>
                              </div>
                              {bet.data.best_outcome_odds[key].length > 1 ? (
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {key} {bet.data.best_outcome_odds[key][2]}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {key}
                                </p>
                              )}
                            </div>
                          )
                        )
                      ) : (
                        <div>
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
                                BOOKMAKER2
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    <td>
                      {showBets ? (
                        <div>
                          <button
                            onClick={() => {
                              setModal(true);
                              setModalBetId(bet.id);
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Calculate Stake
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
                  We couldn&apos;t find any bets in this region. Please consider
                  whitelisting more bookmakers or try again soon.
                </h2>
                <Spinner aria-label="Default status example" />
              </div>
            ) : null}
          </div>

          {!showBets ? (
            <Link href="/#pricing">
                <Image width={700} height={700} src={OverlayImage} alt="your-image-alt" className=" shadow-xl rounded-xl absolute top-72 left-1/2 transform -translate-x-1/2 z-10" />
            </Link>
            ) : null}
        </div>
      </div>
    </>
  );
}
