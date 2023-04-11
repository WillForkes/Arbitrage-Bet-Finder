import { Tracker } from "@/types";
import { calculateStats } from "@/utils";
import { Badge, Dropdown } from "flowbite-react";
import React, { useState } from "react";

function ChartLoader({ d }: { d: Tracker[] }) {
  var stats = calculateStats(d, "All Time");
  function setTimePeriod(time: string) {
    stats = calculateStats(d, time);
  }
  return (
    <div className="px-4 max-w-full lg:px-12">
      <Dropdown label="Time Period">
        <Dropdown.Item onClick={() => setTimePeriod("Week")}>
          Week
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTimePeriod("Month")}>
          Month
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTimePeriod("Year")}>
          Year
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTimePeriod("Penis")}>
          All Time
        </Dropdown.Item>
      </Dropdown>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Total Profit</h2>
          <p className="text-2xl font-bold ">${stats.totalProfit}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Total Stake</h2>
          <p className="text-2xl font-bold">${stats.totalStake}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Pending Bets</h2>
          <p className="text-2xl font-bold">{stats.pendingBets}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Potential $</h2>
          <p className="text-2xl font-bold">${stats.potentialEarnings}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">ROI</h2>
          <p className="text-2xl font-bold ">{stats.ROI}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Total Bets</h2>
          <p className="text-2xl font-bold">{stats.totalBets}</p>
        </div>
      </div>
    </div>
  );
}

export default ChartLoader;
