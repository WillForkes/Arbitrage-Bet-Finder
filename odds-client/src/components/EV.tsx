import { Bet, EV } from "@/types";
import { dateFormat } from "@/utils";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { Table } from "flowbite-react";

interface props {
  b: EV;
}

export default function EVLoader({ b }: props) {
  const [modal, setModal] = useState(false);
  function closeModal(): void {
    setModal(false);
  }

  return (
    <>
      <Table hoverable={false}>
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
        <Table.Body className="divide">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {b.data.match_name}
            </Table.Cell>
            <Table.Cell>{(b.data.ev * 100).toFixed(2)}%</Table.Cell>
            <Table.Cell>{b.data.region.toUpperCase()}</Table.Cell>
            <Table.Cell>{b.data.league.toUpperCase()}</Table.Cell>

            <Table.Cell>{b.data.bookmaker}</Table.Cell>
            <Table.Cell>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setModal(true)}
              >
                Calculate Stake
              </button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <div className="flex justify-center items-center col-start-1 row-span-1 col-span-3 mb-2 content-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => setModal(true)}
        >
          Calculate Stake
        </button>
      </div>

      {/*         
      <div className="bg-grey-800 px-.5 rounded-xl grid grid-cols-3 grid-rows-3 px-3 h-48">
        <div className="col-span-3 grid grid-cols-3">
          <h1>{dateFormat(b.data.match_start_time)}</h1>
          <h1>Profit</h1>
          <h1>Books</h1>
        </div>
        <div className="col-span-3 grid grid-cols-3">
          <h3>{b.data.match_name}</h3>
          <p>{((1 - b.data.total_implied_odds) * 100).toFixed(2)}%</p>
          <div>
            <div className="col-span-3 grid grid-cols-3">
              {Object.keys(b.data.best_outcome_odds).map((key, index) => (
                <div className="">
                  <span key={index}>{b.data.best_outcome_odds[key][0]} </span>
                  <Image
                    width={32}
                    height={37}
                    alt="logo"
                    src={`https://oddsjam.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Foddsjam-static-assets%2Fsportsbook-logos%2F${b.data.best_outcome_odds[
                      key
                    ][0]
                      .toLowerCase()
                      .replace(" ", "")}.jpg&w=64&q=75`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center col-start-1 row-span-1 col-span-3 mb-2 content-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setModal(true)}
          >
            Calculate Stake
          </button>
        </div>
      </div> */}
      <Modal isVisible={modal} closeModal={closeModal} id={b.id} />
    </>
  );
}
