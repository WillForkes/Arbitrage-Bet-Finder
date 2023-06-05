import React, { useContext, useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Spinner } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import Link from "next/link";
import Head from "next/head";
import AdminChart from "@/components/AdminChart";
import SignupDealModal from "@/components/SignupDealModal";

export default function Admin() {
  const [modal, setModal] = useState(false);
  const { data, error } = useSWR("/admin/user/allUsers", getter, {
    refreshInterval: 10000,
  });
  const users = data?.users;
  const siteInfo = {
    totalBets: data?.totalBets,
    totalPlacedBets: data?.totalBetsPlaced,
  };
  const user: { user: User | null; auth: boolean | null } =
    useContext(UserContext);
  if (user.user && !user.user?.dbuser.staff) {
    window.location.assign("/");
  }
  function closeModal() {
    setModal(false);
  }
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
        <AdminChart d={users} siteInfo={siteInfo} />
        <SignupDealModal isVisible={modal} closeModal={closeModal} />
        <button
          onClick={() => setModal(true)}
          className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Signup Deal
        </button>
        <div className="overflow-x-auto">
          {users ? (
            <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <div className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 grid grid-cols-5 gap-4 px-4 py-3 font-semibold uppercase tracking-wider">
                <div>Email</div>
                <div>Created At</div>
                <div>Plan</div>
                <div>Region</div>
                <div>Plan Expires At</div>
              </div>
              <div className="divide-y divide-gray-200">
                {users.map((user: User["dbuser"], index: number) => (
                  <div
                    key={user.email}
                    className={`grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-2 ${
                      index % 2 === 0
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <div className="font-semibold md:hidden mb-1">Email:</div>
                    <div className="text-gray-800 dark:text-gray-300">
                      <Link href={`admin/user/${user.authid}`}>
                        {user.email}
                      </Link>
                    </div>
                    <div className="font-semibold md:hidden mb-1">
                      Created At:
                    </div>
                    <div className="text-gray-800 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="font-semibold md:hidden mb-1">Plan:</div>
                    <div className="text-gray-800 dark:text-gray-300">
                      {user.subscription.length > 0 &&
                      user.subscription[0].status == "active"
                        ? user.subscription[0].plan
                        : "No Subscription/Inactive"}
                    </div>
                    <div className="font-semibold md:hidden mb-1">Region:</div>
                    <div className="text-gray-800 dark:text-gray-300">
                      {user.region}
                    </div>
                    <div className="font-semibold md:hidden mb-1">
                      Plan Expires At:
                    </div>
                    <div className="text-gray-800 dark:text-gray-300">
                      {user.subscription.length > 0
                        ? new Date(
                            user.subscription[0].planExpiresAt
                          ).toLocaleDateString()
                        : "No Subscription"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
}
