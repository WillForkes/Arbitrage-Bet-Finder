import React, { useState, useContext } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Card, Spinner } from "flowbite-react";
import { useRouter } from 'next/router'
import { AlertContext, UserContext } from "@/pages/_app";
import { User } from "@/types";
import { Bet, EV } from "@/types";
import { getBookmakerLogo } from "../../utils";

export default function betPage() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    const { betid } = router.query
    if(!betid) return null;

    let { data, error } = useSWR("/scraper/bet/" + betid, getter, {
        refreshInterval: 10000,
    });
    
    // parse bet data
    let bet = data?.bet
    if(!bet) return null;
    try {
    bet.data = JSON.parse(bet.data)
    }
    catch(e) {  
        console.log(e)
    }

    return (
    <>
        <section className="bg-white dark:bg-gray-900"> 
            <div className="mx-auto max-w-screen-sm py-12">
                <Card>
                    {bet ? (
                        <div className="py-8 px-4 mx-auto max-w-md lg:py-8">
                            <h2 className="mb-2 text-xl font-semibold leading-none text-gray-900 md:text-2xl dark:text-white">{bet.data.match_name}</h2>
                            
                            {bet.type == "ev" ? (
                                <p className="mb-4 text-xl font-extrabold leading-none text-gray-900 md:text-2xl dark:text-white">{(bet.data.ev * 100).toFixed(2)}%</p>
                            ) : (
                                <p className="mb-4 text-xl font-extrabold leading-none text-gray-900 md:text-2xl dark:text-white">+{((1 - bet.data.total_implied_odds) * 100).toFixed(2)}%</p>
                            )}

                            <dl className="flex items-center space-x-6">
                                <div>
                                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Type</dt>
                                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{bet.type}</dd>
                                </div>
                                <div>
                                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Region</dt>
                                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{bet.data.region}</dd>
                                </div>
                                <div>
                                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Market</dt>
                                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{bet.data.key}</dd>
                                </div>
                            </dl>
                            {bet.type == "ev" ? (
                            <dl className="flex items-center space-x-6">
                                <div>
                                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Odds</dt>
                                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{bet.data.odds}</dd>
                                </div>
                                <div>
                                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">No-vig Odds</dt>
                                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{bet.data.noVigOdds}</dd>
                                </div>
                            </dl>
                            ) : (null)}
                        
                            <dl>
                                <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Bookmakers</dt>
                                {bet.type == "arbitrage" ? (
                                    Object.keys(bet.data.best_outcome_odds).map(
                                    (key, index) => (
                                        <div
                                        key={index}
                                        className="flex items-center space-x-3"
                                        >
                                        <div className="flex-shrink-0">
                                            <div className="relative py-1">
                                            <img
                                                className="rounded-md"
                                                src={getBookmakerLogo(
                                                bet.data.best_outcome_odds[key][0]
                                                )}
                                                alt="Bookmaker Logo"
                                                width={25}
                                                height={25}
                                            />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {bet.data.best_outcome_odds[key][0]}
                                            </p>
                                        </div>
                                        {bet.data.best_outcome_odds[key].length > 1 ? (
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {key} {bet.data.best_outcome_odds[key][2]}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {key}
                                            </p>
                                        )}
                                        </div>
                                    )
                                    )
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                            <img
                                                src={getBookmakerLogo(bet.data.bookmaker)}
                                                alt="Bookmaker Logo"
                                                className="rounded-md"
                                                width={25}
                                                height={25}
                                            />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {bet.data.bookmaker}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </dl>
                            <div className="py-4"></div>
                            <dl>
                                <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Details</dt>
                                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">Bet information...</dd>
                            </dl>
                            
                            
                            <div className="flex items-center space-x-4">
                            <button type="button" className="text-white inline-flex items-center focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-700 dark:focus:ring-primary-800">
                                    <svg aria-hidden="true" className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" ></path></svg>
                                    Calculate Stake
                                </button> 
                                <button type="button" className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    <svg aria-hidden="true" className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" ></path></svg>
                                    Add To Bet Tracker
                                </button> 
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
                            <Spinner aria-label="Default status example" />
                        </div>
                    )}
                </Card>
            </div>

        </section>
    </>
    );
}
