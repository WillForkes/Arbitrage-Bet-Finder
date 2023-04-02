import { Tracker } from "@/types";
import { dateFormat, getBookmakerLogo } from "@/utils";
import React, { useState, useContext } from "react";
import { deleteTrackedBet, updateTrackerStatus } from "@/api";
import Image from "next/image";
import Modal from "./Modal";
import { Table } from "flowbite-react";
import { Region, User } from "../types";
import { CSVLink, CSVDownload } from "react-csv";
import { AlertContext, UserContext } from "@/pages/_app";
import Pagination from "./Pagination";

interface props {
  bets: Tracker[];
}

export default function BetLoader({ bets }: props) {
  const user: User | null = useContext(UserContext).user;
  const alertContext = useContext(AlertContext);
  const csvData = [["match_name", "profit", "stake", "settled", "bookmakers", "time"]];
  const [paginatedBets, setPaginatedBets] = useState(bets.slice(0, 10));

  const [modal, setModal] = useState(false);
  function closeModal(): void {
    setModal(false);
  }

  function updateItems(page: number) {
    const start = (page - 1) * 10;
    const end = start + 10;
    setPaginatedBets(bets.slice(start, end));
  }

  function calculateTotalProfit(bets: Tracker[]): number {
    let totalProfit = 0;
    bets.forEach((bet) => {
      if (bet.type == "ev" && bet.status == 2) {
        // if ev bots lost
        totalProfit -= bet.totalStake;
      } else if (
        (bet.type == "ev" && bet.status == 1) ||
        bet.type == "arbitrage"
      ) {
        // if ev bet won
        totalProfit += bet.totalStake * bet.profitPercentage;
      }
    });
    return parseInt(totalProfit.toFixed(2));
  }

  function deleteBet(betId: number): void {
    deleteTrackedBet(betId)
      .then(() => {
        alertContext?.setAlert({
          msg: "Bet deleted successfully!",
          error: false,
        });
        closeModal();
      })
      .catch((err) => {
        alertContext?.setAlert({
          msg: "Failed to delete bet!",
          error: true,
        });
      });
  }

  if (bets.length === 0) {
    return (
      <>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <span className="font-bold tracking-wider uppercase dark:text-primary-700">
              Bet Tracker
            </span>
            <h2 className="text-4xl font-bold lg:text-5xl">
              You have no tracked bets!
            </h2>
          </div>
        </div>
      </>
    );
  } else {
    paginatedBets.forEach((bet) => {
      const bookmakerString = JSON.parse(bet.bookmakers).join(", ");
      csvData.push([
        bet.matchName,
        (bet.totalStake * bet.profitPercentage).toString(),
        bet.totalStake.toString(),
        bet.status == 0 ? "Pending" : (bet.status == 1) ? "Won" : "Lost",
        bookmakerString,
        bet.createdAt,
      ]);
    });

    return (
      <>
        <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
          <div className="px-4 mx-auto max-w-screen-2xl lg:px-12">
            <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
              <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                <div className="flex items-center flex-1 space-x-4">
                  <h5>
                    <span className="text-gray-500">Total bets:</span>
                    <span className="dark:text-white"> {bets.length}</span>
                  </h5>
                  <h5>
                    <span className="text-gray-500">Total profit:</span>
                    <span className="dark:text-white">
                      {" "}
                      ${calculateTotalProfit(bets)}
                    </span>
                  </h5>
                </div>
                <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                  >
                    <svg
                      className="h-3.5 w-3.5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                    Add new bet
                  </button>
                  {(user?.dbuser.plan != "free") ? (
                    <CSVLink data={csvData} className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                        </svg>
                        Export
                    </CSVLink>
                  ) : (
                    <button onClick={() => {
                        alertContext?.setAlert({
                            msg: "CSV Bet Export is only available on the Pro or Plus plan!",
                            error: true,
                        });
                    }} className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                        </svg>
                        Export
                    </button>
                    )}

                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all"
                            type="checkbox"
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="checkbox-all" className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Match Name
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Profit Percentage
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Total Stake
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Profit
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Bookmakers
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Time
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bets.map((bet) => (
                      <tr
                        key={bet.id}
                        className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="w-4 px-4 py-3">
                          <div className="flex items-center">
                            <input
                              id="checkbox-table-search-1"
                              type="checkbox"
                              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="checkbox-table-search-1"
                              className="sr-only"
                            >
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {bet.type.toUpperCase()}
                        </th>

                        <th
                          scope="row"
                          className="items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {bet.matchName}
                        </th>

                        <td className="px-4 py-2">
                          {bet.type == "ev" && bet.status == 2 ? (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-red-600 dark:text-red-300">
                              0% (lost)
                            </span>
                          ) : bet.type == "ev" && bet.status == 0 ? (
                            <span className="bg-red-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-600 dark:text-primary-300">
                              {(bet.profitPercentage * 100).toFixed(2)}%?
                            </span>
                          ) : (
                            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-600 dark:text-green-300">
                              {(bet.profitPercentage * 100).toFixed(2)}%
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            ${bet.totalStake}
                          </div>
                        </td>

                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {/* bunch of conditional shit for if the ev bet was lost or won or outcome not decided */}
                          <div
                            className={`flex items-center ${
                              bet.type == "ev" && bet.status == 2
                                ? "dark:text-red-700"
                                : ""
                            }`}
                          >
                            {bet.type == "ev" && bet.status == 2 ? (
                              <p>-${bet.totalStake}</p>
                            ) : bet.type == "ev" && bet.status == 0 ? (
                              <p>?</p>
                            ) : (
                              "$" +
                              (bet.totalStake * bet.profitPercentage).toFixed(2)
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {JSON.parse(bet.bookmakers).map(
                            (bookmaker: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3"
                              >
                                <div className="flex-shrink-0">
                                  <div className="relative py-1">
                                    <img
                                      className="rounded-md"
                                      src={getBookmakerLogo(bookmaker)}
                                      alt="Bookmaker Logo"
                                      width={25}
                                      height={25}
                                    />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {bookmaker}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </td>

                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            {new Date(bet.updatedAt).toLocaleString()}
                          </div>
                        </td>

                        <td>
                          <div className="py-1">
                            <button
                              onClick={() => {
                                deleteBet(bet.id);
                              }}
                              className="flex items-center justify-center flex-shrink-0 px-2 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-red-700 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-red-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>

                          {bet.type == "ev" && bet.status == 0 ? (
                            <div>
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    updateTrackerStatus(bet.id, 1);
                                    alertContext?.setAlert({
                                      msg: "Bet status updated!",
                                      error: false,
                                    });
                                  }}
                                  className="flex items-center justify-center flex-shrink-0 px-2 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-green-700 dark:bg-green-800 dark:text-white dark:border-green-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                  Bet Won
                                </button>
                              </div>

                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    updateTrackerStatus(bet.id, 2);
                                    alertContext?.setAlert({
                                      msg: "Bet status updated!",
                                      error: false,
                                    });
                                  }}
                                  className="flex items-center justify-center flex-shrink-0 px-2 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-red-700 dark:bg-red-800 dark:text-white dark:border-red-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                  Bet Lost
                                </button>
                              </div>
                            </div>
                          ) : null}
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
        </section>
      </>
    );
  }
}
