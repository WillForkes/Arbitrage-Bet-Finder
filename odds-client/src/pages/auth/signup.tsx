import React, { useEffect } from "react";
import Head from "next/head";
import { Spinner } from "flowbite-react";

export default function Signup() {
  useEffect(() => {
    window.location.assign(process.env.NEXT_PUBLIC_URI + "/sign-up");
  });

  return(
    <section className="bg-white dark:bg-gray-900 page-offset-x py-8 bg-gray-900">
        <Head>
            <title>Arbster | Register</title>
            <meta name="description" content="Register at Arbster here." />
        </Head>

        <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
            <h2 className="text-md font-bold dark:text-white mb-2">
                Loading register page...
            </h2>
            <Spinner aria-label="Default status example" />
        </div>
    </section>
);
}
