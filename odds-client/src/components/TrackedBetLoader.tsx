import { Bet, BetTrack, Tracker } from "@/types";
import { dateFormat } from "@/utils";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { Table } from "flowbite-react";
import { Region } from "../types";

interface props {
  b: Tracker;
  showBets: boolean;
}

export default function BetLoader({ b, showBets }: props) {
  const [modal, setModal] = useState(false);
  function closeModal(): void {
    setModal(false);
  }

  return (
    <>
      <Table hoverable={false} className="items-center">
        <Table.Head>
          <Table.HeadCell>Match</Table.HeadCell>
          <Table.HeadCell>Profit</Table.HeadCell>
          <Table.HeadCell>Region</Table.HeadCell>
          <Table.HeadCell>League</Table.HeadCell>
          <Table.HeadCell>Bookmakers</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className={`divide ${showBets ? "" : "blur"}`}>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {JSON.parse(b.bet.data).match_name}
            </Table.Cell>
            <Table.Cell>
              {/* if showBets is true, show the real data, else use a placeholder value */}
              $
              {showBets
                ? (b.profitPercentage * b.totalStake).toFixed(2)
                : "$0.00"}
            </Table.Cell>
            <Table.Cell>
              {showBets
                ? JSON.parse(b.bet.data).region.toUpperCase()
                : "REGION"}
            </Table.Cell>
            <Table.Cell>
              {showBets
                ? JSON.parse(b.bet.data).leagueFormatted
                : "SPORT_LEAGUE"}
            </Table.Cell>

            <Table.Cell>
              {Object.keys(JSON.parse(b.bet.data).best_outcome_odds).map(
                (key, index) => (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <Image
                          src=""
                          alt="Bookmaker Logo"
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {showBets
                          ? JSON.parse(b.bet.data).best_outcome_odds[key][0]
                          : "BOOKMAKER"}
                      </p>
                    </div>
                  </div>
                )
              )}
            </Table.Cell>
            <Table.Cell>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setModal(true)}
              >
                Show Details
              </button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Modal isVisible={modal} closeModal={closeModal} id={b.id} />
    </>
  );
}
