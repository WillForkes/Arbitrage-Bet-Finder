import { UserContext } from "@/pages/_app";
import { Tracker, User } from "@/types";
import { calculateStats } from "@/utils";
import { Badge, Dropdown } from "flowbite-react";
import React, { useContext, useState } from "react";

function AdminChart({
  d,
  siteInfo,
}: {
  d: User["dbuser"][];
  siteInfo: { totalBets: number; totalPlacedBets: number };
}) {
  const user = useContext(UserContext);
  function countSubscribedUsers(data: User["dbuser"][]) {
    let count = 0;
    data.forEach((user: User["dbuser"]) => {
      if (user.subscription && user.subscription.length > 0) {
        count++;
      }
    });

    return count;
  }

  function countSubscribedUsersToday(
    data: User["dbuser"][],
    lastDay = 86400000
  ) {
    let count = 0;
    const lastDayMs = new Date().getTime() - lastDay;

    data.forEach((user) => {
      if (user.subscription && user.subscription.length > 0) {
        const latestSubscription =
          user.subscription[user.subscription.length - 1];
        const planExpiresAtMs = new Date(
          latestSubscription.planExpiresAt
        ).getTime();
        if (planExpiresAtMs > lastDayMs) {
          count++;
        }
      }
    });
    return count;
  }
  return (
    <div className="px-4 py-6 max-w-full lg:px-12">
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Total Users</h2>
          <p className="text-2xl font-bold ">{d ? d.length : "pp "}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Total Subscriptions</h2>
          <p className="text-2xl font-bold">
            {d ? countSubscribedUsers(d) : "pp"}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Subscribers Today</h2>
          <p className="text-2xl font-bold">
            {d ? countSubscribedUsersToday(d) : "pp"}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Total Bets Available</h2>
          <p className="text-2xl font-bold">
            {siteInfo ? siteInfo.totalBets : "pp"}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Bets Placed</h2>
          <p className="text-2xl font-bold ">
            {siteInfo ? siteInfo.totalPlacedBets : 0}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow dark:text-white">
          <h2 className="text-lg font-bold mb-4">Another Stat</h2>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}

export default AdminChart;
