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
      <Modal isVisible={modal} closeModal={closeModal} id={b.id} />
    </>
  );
}
