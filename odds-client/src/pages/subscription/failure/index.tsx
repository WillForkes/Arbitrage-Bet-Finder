import React, { useState } from "react";
import Image from "next/image";
import { Accordion } from "flowbite-react";
import Link from "next/link";

export default function Maintainance() {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto py-64 relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 p-2 flex items-center justify-center mx-auto mb-3.5">
              <svg
                fill="#fa2a2a"
                className="w-8 h-8"
                strokeLinejoin="round"
                stroke-miterlimit="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
              </svg>
              <span className="sr-only">Failure</span>
            </div>
            <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Hmm, something went wrong
            </p>
            <p className="mb-4 text-md font-semibold text-gray-900 dark:text-white">
              We weren&apos;t able to process your payment, please contact our
              support team for further assistance!
            </p>
            <Link
              href="/"
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
