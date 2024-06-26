import React, { useState, useContext } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Card, Spinner, TextInput, Badge } from "flowbite-react";
import { useRouter } from "next/router";
import { getBookmakerLogo } from "../../utils";
import Modal from "@/components/Modal";
import EVModal from "@/components/EVModal";
import { EV } from "@/types";
import SimulateModal from "@/components/SimulateModal";
import Head from "next/head";

export default function BetPage() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [simModal, setSimModal] = useState(false);
  const [bankroll, setBankroll] = useState<null | number>(null);
  const [evm, setEV] = useState(false);
  const [modalBetId, setModalBetId] = useState(0);
  const { betid } = router.query;

  const { data, error } = useSWR("/scraper/bet/" + betid, getter, {
    refreshInterval: 10000,
  });

  // parse bet data
  let bet = data?.bet;
  if (error || !bet) {
    return (
      <section className=" dark:bg-gray-900 page-offset-x py-8 bg-gray-900">
        <div className="mx-auto max-w-screen-full p-32 text-center mb-8 lg:mb-12">
          <h2 className="text-md font-bold dark:text-white mb-2">
            This bet does not exist or may have expired. Please try again soon.
          </h2>
          <Spinner aria-label="Default status example" />
        </div>
      </section>
    );
  }

  try {
    bet.data = JSON.parse(bet.data);
    setModalBetId(bet.id);
  } catch (e) {
    console.log(".");
  }

  function closeModal() {
    setModal(false);
  }

  function closeSimModal() {
    setSimModal(false);
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

  const exchanges = [
    "betfair",
    "matchbook",
    "smarkets"
  ];

  return (
    <>
      {bet.type == "arbitrage" ? (
        <Modal isVisible={modal} closeModal={closeModal} id={modalBetId} />
      ) : (
        <EVModal
          id={modalBetId}
          recBetSize={parseInt(calculateRecommendedBetSize(bet, bankroll!))}
          isVisible={modal}
          closeModal={closeModal}
        />
      )}
      <section className="bg-white dark:bg-gray-900">
        <Head>
          <title>Arbster | Viewing Bet</title>
          <meta name="description" content="Detailed bet viewing page" />
        </Head>
        <SimulateModal
          isVisible={simModal}
          id={bet.id}
          closeModal={closeSimModal}
        />
        <div className="mx-auto max-w-screen-md py-12">
          <Card>
            {bet ? (
              <div className="py-8 px-4 mx-auto  lg:py-8">
                <h2 className="mb-2 text-xl font-semibold leading-none text-gray-900 md:text-2xl dark:text-white">
                  {bet.data.match_name}
                </h2>
                <h2 className="mb-2 text-md font-semibold leading-none text-gray-900 md:text-lg dark:text-white">
                  {bet.data.league.replace(/_/g, " ")}
                </h2>

                <div className="flex items-center justify-between mb-2">
                  {bet.type == "ev" ? (
                    <span className="bg-primary-100 text-primary-800 text-xs font-extrabold px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                      {(bet.data.ev * 100).toFixed(2)}%
                    </span>
                  ) : (
                    <span className="bg-primary-100 text-primary-800 text-xs font-extrabold px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                      +
                      {((1 / bet.data.total_implied_odds - 1) * 100).toFixed(2)}
                      %
                    </span>
                  )}
                </div>
                <div className="flex mx-auto flex-wrap gap-1 mb-3">
                    {bet.data?.live == true ? (
                    <div>
                        <Badge>IN PLAY</Badge>
                    </div>
                    ) : null}

                    {exchanges.map((ex) => (
                        <div key={ex}>
                            {JSON.stringify(bet.data.best_outcome_odds).toLowerCase().includes(ex) ? (
                                <Badge color="purple">USES EXCHANGE(s)</Badge>
                            ) : null}
                        </div>
                    ))}
                </div>
                
                <dl className="flex items-center space-x-6">
                  <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                      Type
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                      {bet.type.toUpperCase()}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                      Region
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                      {bet.data.region.toUpperCase()}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                      Market
                    </dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                      {bet.data.key.toUpperCase()}
                    </dd>
                  </div>
                </dl>
                {bet.type == "ev" ? (
                  <dl className="flex items-center space-x-6">
                    <div>
                      <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        Odds
                      </dt>
                      <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {bet.data.odds}
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        No-vig Odds
                      </dt>
                      <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {bet.data.noVigOdds.toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                ) : null}

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-2">
                  <thead>
                    <tr>
                      <th className="text-left font-bold leading-none text-gray-900 dark:text-white">
                        Bookmakers
                      </th>
                      <th className="text-left font-bold leading-none text-gray-900 dark:text-white">
                        Odds
                      </th>
                      <th className="text-left font-bold leading-none text-gray-900 dark:text-white">
                        Outcome (bet on)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bet.type === "arbitrage" ? (
                      Object.keys(bet.data.best_outcome_odds).map(
                        (key, index) => (
                          <tr key={index}>
                            <td className="py-2 flex items-center">
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
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate ml-2">
                                  {bet.data.best_outcome_odds[key][0]}
                                </span>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {bet.data.best_outcome_odds[key][1]}
                              </span>
                            </td>
                            <td className="py-2">
                              {bet.data.best_outcome_odds[key].length > 2 ? (
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {key} {bet.data.best_outcome_odds[key][2]}
                                </span>
                              ) : (
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {key}
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td className="py-2 flex items-center">
                          <div className="flex-shrink-0">
                            <div className="relative py-1">
                              <img
                                className="rounded-md"
                                src={getBookmakerLogo(bet.data.bookmaker)}
                                alt="Bookmaker Logo"
                                width={25}
                                height={25}
                              />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate ml-2">
                              {bet.data.bookmaker}
                            </span>
                          </div>
                        </td>
                        <td className="py-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {bet.data.odds}
                          </span>
                        </td>
                        <td className="py-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {bet.data.team}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <dl>
                  <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                    Details
                  </dt>
                  <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                    {bet.type == "arbitrage" ? (
                      <>
                        This bet between {bet.data.match_name} is an arbitrage
                        opportunity. This means you can place a bet on both
                        outcomes of the match in a given market and make a
                        profit regardless of the outcome due to discrepencies
                        between different bookmakers.
                      </>
                    ) : (
                      <>
                        This bet between {bet.data.match_name} is an EV
                        opportunity. This EV bet suggests you should place a bet
                        on {bet.data.team} which mathematically will return an
                        expected value of {(bet.data.ev * 100).toFixed(2)}% over
                        the long term. This bet is based on the odds of{" "}
                        {bet.data.bookmaker} with no-vig odds of{" "}
                        {bet.data.noVigOdds.toFixed(2)}.
                      </>
                    )}
                  </dd>
                </dl>

                <div className="flex mb-4 mx-auto flex-wrap gap-2">
                  <Badge>
                    Disclaimer: We strive to provide accurate and up-to-date
                    odds, but please note that bookmakers may change their odds
                    without prior notice. It is your responsibility to
                    independently verify the real-time odds with the bookmakers
                    before placing bets based on our displayed odds. We are not
                    liable for any losses incurred due to discrepancies between
                    our displayed odds and the actual odds offered by
                    bookmakers.
                  </Badge>
                </div>

                <div className="flex items-center space-x-4">
                  {bet.type == "ev" ? (
                    <button
                      onClick={() => setSimModal(true)}
                      className=" mr-4 text-white inline-flex items-center bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                    >
                      Simulate EV Bet
                    </button>
                  ) : null}

                  {bet.type == "arbitrage" || evm == true ? (
                    <button
                      onClick={() => setModal(true)}
                      type="button"
                      className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <svg
                        aria-hidden="true"
                        className="mr-1 -ml-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                        <path d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                      </svg>
                      Calculate Stake
                    </button>
                  ) : (
                    <div className="">
                      <TextInput
                        className="inline-flex"
                        type="number"
                        placeholder="Input your bankroll"
                        value={bankroll == null ? "" : bankroll}
                        onChange={(e) => setBankroll(parseInt(e.target.value))}
                      />
                      <button
                        onClick={() => setEV(true)}
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
                <h2 className="text-md font-bold dark:text-white">
                  This bet may not exist or has been deleted.
                </h2>

                <Spinner aria-label="Default status example" />
              </div>
            )}
          </Card>
        </div>
      </section>
    </>
  );
}
