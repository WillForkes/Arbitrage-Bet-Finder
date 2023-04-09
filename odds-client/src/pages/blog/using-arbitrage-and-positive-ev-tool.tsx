/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../public/arbster.png";
import Link from "next/link";

export default function blog1() {
    return (
    <>
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
            <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                    <header className="mb-4 lg:mb-6 not-format">
                        <address className="flex items-center mb-6 not-italic">
                            <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                                <Image className="mr-4 w-16 h-16 rounded-full" src={Logo} alt="Logo" />
                                <div>
                                    <a href="#" rel="author" className="text-xl font-bold text-gray-900 dark:text-white">Arbster Team</a>
                                    <p className="text-base font-light text-gray-500 dark:text-gray-400">CEO of Arbster</p>
                                    <p className="text-base font-light text-gray-500 dark:text-gray-400">Feb. 8, 2022</p>
                                </div>
                            </div>
                        </address>
                        <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                            Using our arbitrage and positive EV tool
                        </h1>
                    </header>
                    <p className="lead">
                        Arbster's arbitrage detection tool is designed to scan various bookmakers and exchanges to identify instances where the odds offered for 
                        different outcomes of a particular event 
                        allow for an arbitrage opportunity. Here's how you can use this feature:    
                    </p>
                    
                    <h2>Using the arbitrage tool</h2>
                    <figure><img src="https://www.completesports.com/wp-content/uploads/2020/11/Arbitrage-Sports-Betting.jpg" alt="" />
                        <figcaption>Digital art by Complete Sports Nigeria</figcaption>
                    </figure>
                    <p>A step by step guide to getting you on your way to betting success</p>
                    <ol>
                        <li><strong>1. </strong> Log in to your Arbster account and go to the 'arbitrage tool' section.</li>
                        <li><strong>2. </strong> Search the list for a match you wish to place a bet on.</li>
                        <li><strong>3. </strong> Click on a bet to view details more clearly</li>
                        <li><strong>4. </strong> Arbster will then display details and the bookmakers offering odds on the selected event, and highlight any opportunities for arbitrage.</li>                        
                        <li><strong>5. </strong> Find the market on the match in the displayed bookmakers and verify the odds reflect the odds on Arbster</li> 
                        <li><strong>6. </strong> Use the 'calculate stake' feature in order to identify how much to place on each side of the arbitrage bet.</li> 
                        <li><strong>7. </strong> Once you have identified an arbitrage opportunity and made sure the odds remain the same, place your bets on all possible outcomes at the various bookmakers or exchanges, making sure to calculate the appropriate stakes to ensure a guaranteed profit.</li> 
                        <li><strong>7. </strong> You can then add the bet to the bet tracker which will keep track of all your past bets, profit and statistics</li> 
                        <li><strong>8. </strong> Wait for the match to finish and reap the rewards!</li> 
                    </ol>

                    <h2>Using the positive EV tool</h2>
                    <figure><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTspOoQAJiAOtA7KNZQFz9q5Bcpg7gLIIguDw&usqp=CAU" alt="" />
                        <figcaption>Digital art by Punter2Pro</figcaption>
                    </figure>
                    <p>The Positive EV tool is designed to help you identify betting opportunities with a positive expected value. Expected value (EV) is a mathematical concept used to determine the long term profitability of a bet. Here's how you can use this feature:</p>
                    <ol>
                    <li><strong>1. </strong> Log in to your Arbster account and go to the 'positive EV tool' section.</li>
                    <li><strong>2. </strong> Arbster will then display all the upcoming matches and calculate the expected value for each bet.</li>
                    <li><strong>3. </strong> Use the traffic light signal to determine the probability of winning the bet and which bet you want to go ahead with. The lower then win probability indicates a longer expected time to make a positive return.</li>
                    <li><strong>4. </strong> Monitor the bet and ensure it is placed before the odds change or the event starts.</li>
                    <li><strong>5. </strong> Click 'input bankroll' to determine the recommended stake size. This is calculated using the Kelly Criterion formula</li>
                    <li><strong>6. </strong> Place your bets on the correct exchange accordingly.</li>
                    <li><strong>7. </strong> Click 'add to tracker' in order to keep track of your positive EV bets.</li>
                    </ol>

                    <p>
                        Using Arbster's arbitrage arbitrage tool and positive EV tool can help you make profitable betting decisions. However, it's important to note that betting always carries a degree of risk, and you should never bet more than you can afford to lose. Good luck!
                    </p>

                    <Link href="/#blog"
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        Back To Blog
                    </Link>     
                </article>
                
            </div>
        </main>
    </>
    );
}
