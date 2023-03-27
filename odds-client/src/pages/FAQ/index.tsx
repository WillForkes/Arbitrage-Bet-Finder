import React, { useState } from "react";
import Image from "next/image";
import { Accordion } from "flowbite-react";
import Link from "next/link";

export default function FAQ() {
  return (
    <>
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Frequently asked questions</h2>
                <div className="grid pt-8 text-left border-t border-gray-200 md:gap-16 dark:border-gray-700 md:grid-cols-2">
                    <div>
                        <div className="mb-10">
                            <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" ></path></svg>
                                What is arbitrage betting?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Arbitrage betting, also known as sure betting or miraclebetting, is a betting strategy that involves placing bets on all possible outcomes of a sporting event or a market, in order to ensure a profit regardless of the outcome. It requires finding and exploiting discrepancies in odds offered by different bookmakers.
                            </p>
                        </div>
                        <div className="mb-10">                        
                            <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" ></path></svg>
                                What is an Arbitrage betting service?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                An arbitrage betting service is a tool that helps bettors to identify arbitrage opportunities quickly and efficiently. The service scans different bookmakers' odds and identifies situations where the combined odds for all possible outcomes of an event are lower than 100%, which means a guaranteed profit can be made. 
                            </p>
                        </div>
                        <div className="mb-10">
                            <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" ></path></svg>
                                How does Arbster work?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">Our service uses advanced algorithms to scan and compare odds from multiple bookmakers in real-time. It identifies any discrepancies and highlights profitable opportunities. It is extremely beginner friendly and helps our users to make informed decisions and secure a healthy profit.</p>
                            <p className="text-gray-500 dark:text-gray-400">Feel free to <Link href="/contact" className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline" target="_blank" rel="noreferrer">contact us</Link> and we'll help you out as soon as we can.</p>
                        </div>
                        <div className="mb-10">
                            <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" ></path></svg>
                                How is Arbster different from others on the market?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">Our arbitrage betting service is competitively priced and has better functionality compared to many other arbitrage betting services. We continuously update our service to ensure it remains cutting-edge and effective. We also provide excellent customer support and assistance to our clients. </p>
                        </div>
                    </div>
                    <div>
                        <div className="mb-10">
                            <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" ></path></svg>
                                Is arbitrage betting legal?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                            Yes, arbitrage betting is legal in most countries. However, some bookmakers may not allow it, and it is important to check the terms and conditions of each bookmaker before placing bets. We do not condone any illegal or unethical activity related to arbitrage betting.</p>
                        </div>
                        <div className="mb-10">
                            <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" ></path></svg>
                                Is your service suitable for beginners?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">Yes, our service is user-friendly and easy to use, making it suitable for beginners. We also provide comprehensive tutorials and support to help users get started with arbitrage betting. Check out our discord server for more support!</p>
                        </div>
                        <div className="mb-10">
                            <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" ></path></svg>
                                Can your service guarantee a profit?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">(Yes, when used correctly.) While our service can offers realtime betting opportunity, we cannot account for sudden changes in the market environment. Rapid unexpected changes are rare however it always remains a possiblity. Hence, we suggest using a risk management system to ensure you never lose out big.</p>
                        </div>
                        <div className="mb-10">
                            <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" ></path></svg>
                                Do you offer a free trial?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">Yes, we offer a free trial of our arbitrage betting service for a limited period of time. This allows potential clients to test the software and see its effectiveness before making a purchase. Get your free trial <Link href="/#trial" className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline" target="_blank" rel="noreferrer">here</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  );
}

// Q: What is arbitrage betting?
// A: Arbitrage betting, also known as sure betting or miraclebetting, is a betting strategy that involves placing bets on all possible outcomes of a sporting event or a market, in order to ensure a profit regardless of the outcome. It requires finding and exploiting discrepancies in odds offered by different bookmakers.

// Q: What is an Arbitrage betting service?
// A: An arbitrage betting service is a tool that helps bettors to identify arbitrage opportunities quickly and efficiently. The service scans different bookmakers' odds and identifies situations where the combined odds for all possible outcomes of an event are lower than 100%, which means a guaranteed profit can be made. 

// Q: How does Arbster work?
// A: Our arbitrage betting service uses advanced algorithms to scan and compare odds from multiple bookmakers in real-time. It identifies any discrepancies and highlights profitable opportunities. It is extremely beginner friendly and can obtain very large amounts of profit. 

// Q: How is Arbster different from others on the market?
// A: Our arbitrage betting service is competitively priced and has better functionality compared to many other arbitrage betting services. We continuously update our service to ensure it remains cutting-edge and effective. We also provide excellent customer support and assistance to our clients. 

// Q: Is arbitrage betting legal?
// A: Yes, arbitrage betting is legal in most countries. However, some bookmakers may not allow it, and it is important to check the terms and conditions of each bookmaker before placing bets. We do not condone any illegal or unethical activity related to arbitrage betting.

// Q: Is your service suitable for beginners?
// A: Yes, our service is user-friendly and easy to use, making it suitable for beginners. We also provide comprehensive tutorials and support to help users get started with arbitrage betting. 

// Q: Can your service guarantee a profit?
// A: (Yes, when used correctly.) While our service can identify profitable opportunities, we cannot guarantee a profit. The success of arbitrage betting depends on many factors, including the odds offered by bookmakers, the size of the bets, and the fees charged by payment processors. It is important to understand the risks involved and to bet responsibly. 

// Q: Do you offer a free trial?
// A: Yes, we offer a free trial of our arbitrage betting service for a limited period of time. This allows potential clients to test the software and see its effectiveness before making a purchase. Get your free trial here -> http://arbster.com/ 
