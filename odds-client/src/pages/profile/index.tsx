import ProfileLoader from "@/components/ProfileLoader";
import { User, Invoice } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Spinner } from "flowbite-react";
import Head from "next/head";

export default function Profile() {
  // Get profile data
  let { data, error } = useSWR("/profile", getter);
  const user: User = data;

  // Get invoice data
  const { data: invoicesData, error: invoiceError } = useSWR(
    "/payment/get-invoices",
    getter
  );
  const invoices: Invoice[] = invoicesData?.invoices;

  // Get bookmaker data
  const { data: booksData, error: bookError } = useSWR(
    "/scraper/bookmakers",
    getter
  );
  var books = booksData;

  return (
    <div>
        <Head>
            <title>Arbster | Profile</title>
            <meta name="description" content="Edit and view your profile on Arbster" />
        </Head>
      {data && invoices ? (
        <ProfileLoader
          user={user}
          invoices={invoices}
          bookMakers={books}
          key={user.auth0.sid}
        />
      ) : (
        <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
          <Spinner aria-label="Default status example" />
        </div>
      )}
    </div>
  );
}
