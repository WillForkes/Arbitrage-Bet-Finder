import BetLoader from "@/components/BetLoader";
import { Bet, EV } from "@/types";
import React, { useState, useContext } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import EVLoader from "@/components/EV";
import Auth from "@/components/Auth";
import { Spinner } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import { Card } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

export default function Ev() {
  const { data, error } = useSWR("/scraper/all?type=ev", getter, {
    refreshInterval: 10000,
  });
  const evData = data?.ev;
  const user: User | null = useContext(UserContext).user;
  const showBets = user
    ? user.dbuser.plan == "pro" ||
      user.dbuser.plan == "plus" ||
      user.dbuser.staff
    : false;

  return (
    <div className="page-offset-x py-8 bg-gray-900">
        <Head>
            <title>Arbster | Positive EV Tool</title>
            <meta name="description" content="Advanced positive EV tool for identifying bets where the odds are weighed in your favour" />
        </Head>
        <div className="mx-auto text-center mb-4 px-4">
            <Card className="rounded-md mb-2">
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-4xl xl:text-5xl dark:text-white inline-flex">
                            What is a <p className="dark: text-primary-700 ml-2 mr-2">Positive EV</p> Bet?
                        </h1>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                            Watch this short video or read the blog post to learn more about positive EV betting.
                        </p>
                        {user?.dbuser.trialActivated == false ? (
                            <Link href="/#pricing" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                Start your free trial
                            </Link>
                        ) : (null)}
                        
                        {!user ? (
                            <Link href="/auth/login" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                Start your free trial
                            </Link>
                        ) : (null)}

                        <Link href="/blog/what-is-a-positive-ev-bet" className="mr-2 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            Read the blog
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </Link> 
                        <Link href="/blog/using-the-positive-ev-tool" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            Using the tool
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </Link> 

                    </div>
                    <div className=" md:scale-100 sm:scale-75 lg:mt-0 lg:col-span-5 lg:flex">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/GqU1nCtBvYM" title="What is a positive EV bet?" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </div>           
                </div>
            </Card>
        </div>
      {data ? (
        <div className="rounded-md gap-6 grid-cols-1 2xl:grid-cols-2 mb-2">
          <EVLoader bets={evData} showBets={showBets} user={user} />
        </div>
      ) : (
        <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
          <Spinner aria-label="Default status example" />
        </div>
      )}
    </div>
  );
}
