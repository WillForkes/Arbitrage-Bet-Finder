import React, { useState, useContext } from "react";
import Image from "next/image";
import { Accordion } from "flowbite-react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import { Spinner } from "flowbite-react";
import { getOrderFromStripePaymentID, getter } from "@/api";
import useSWR from "swr";
import Head from "next/head";
export default function SuccessSubscriptionPage() {
  // Get session_id query param
  const router = useRouter();
  const { subid } = router.query;
  const { data, error } = useSWR("/payment/get-subscription/" + subid, getter);

  if (error || !data || data?.status != "ACTIVE") {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <h2 className="text-2xl font-semibold">Locating order...</h2>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Script id="grow_affiliate_succcess_tracking">
        {`
                tdconv('init', '2353477', {'element': 'iframe' });
                tdconv('track', 'sale', {'transactionId':'${
                  data.id
                }', 'ordervalue':[${
          typeof data.billing_info.last_payment?.amount != null
            ? data.billing_info.last_payment?.amount.value
            : 0
        }], 'voucher':'[]', 'currency':'GBP', 'event':436265});
            `}
      </Script>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto py-64 relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-green-500 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
              </svg>
              <span className="sr-only">Success</span>
            </div>
            <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Successfully subscribed!
            </p>
            <p className="mb-4 text-md font-semibold text-gray-900 dark:text-white">
              Ready to start making money?
            </p>
            <Link
              href="/onboarding"
              className="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Continue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
