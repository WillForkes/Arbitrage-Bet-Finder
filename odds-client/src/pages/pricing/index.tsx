import React, { useEffect } from "react";
import Head from "next/head";
import { Spinner } from "flowbite-react";
import Pricing from "@/components/Home/Pricing";

export default function Login() {
  return (
    <section className="bg-white dark:bg-gray-900 page-offset-x py-8 bg-gray-900">
        <Head>
            <title>Arbster | Pricing</title>
            <meta name="description" content="View our monthly pricing plans starting at only £29,99 with a 14-day money back guarantee!" />
        </Head>
        <Pricing />
    </section>
    );
}
