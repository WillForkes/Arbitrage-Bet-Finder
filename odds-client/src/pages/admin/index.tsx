import BetLoader from "@/components/BetLoader";
import { Bet } from "@/types";
import React, { useState, useContext } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Spinner } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import Auth from "@/components/Auth";
import Link from "next/link";
import Head from "next/head";

export default function Admin() {
  const { data, error } = useSWR("/admin/user/allUsers", getter, {
    refreshInterval: 10000,
  });
  const users = data?.users;
  const user: { user: User | null; auth: boolean | null } =
    useContext(UserContext);

  return (
    <div className="page-offset-x py-8 bg-gray-900">
      <Head>
        <title>Arbster | Admin Tool</title>
        <meta
          name="description"
          content="Advanced arbitrage tool for identifying profitable bet opportunities across a range of bookmakers"
        />
      </Head>
      <div className="px-4 mx-auto max-w-screen-2xl lg:px-4">
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="mx-auto max-w-screen-md mb-8 lg:mb-12">
              <div className="overflow-x-auto">
                {users ? (
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                          Region
                        </th>
                        <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                          Plan Expires At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user: User["dbuser"]) => (
                        <tr key={user.email}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {user.email}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {user.subscription.length > 0
                              ? user.subscription[0].plan
                              : "No Subscription"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {user.region}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {user.subscription.length > 0
                              ? new Date(
                                  user.subscription[0].planExpiresAt
                                ).toLocaleDateString()
                              : "No Subscription"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
