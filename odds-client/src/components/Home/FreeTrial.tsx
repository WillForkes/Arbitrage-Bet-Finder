import { startFreeTrial } from "@/api";
import { Plan } from "@/types";
import { useRouter } from "next/router";
import Image from "next/image";
import React, { useContext } from "react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import Link from "next/link";
import { AlertContext } from "@/pages/_app";
import { Toast } from "flowbite-react";

export default function FreeTrial() {
  const user: User | null = useContext(UserContext).user;

  return (
    <>
      <section className="bg-white dark:bg-gray-800">
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          <Image
            width={600}
            height={300}
            className="w-full dark:hidden"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
            alt="dashboard image"
          />
          <Image
            width={600}
            height={300}
            className="w-full hidden dark:block"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg"
            alt="dashboard image"
          />
          <div className="mt-4 md:mt-0">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Try for free today.
            </h2>
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
            Rev up your sports betting with Arbster. Try it for free for 5 days and get full access to our powerful service. Witness how our arbitrage betting dashboard and positive EV tool can help you make smarter bets and win big. Start your winning streak today.
            </p>

            {user ? (
              <a
                href="#pricing"
                className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900"
              >
                Select Plan
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"></path>
                </svg>
              </a>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900"
              >
                Login to Start Free Trial
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"></path>
                </svg>
              </Link>
            )}
            
          </div>
        </div>
      </section>
    </>
  );
}
