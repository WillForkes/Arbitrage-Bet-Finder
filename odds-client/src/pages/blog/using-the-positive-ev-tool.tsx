/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../public/arbster.png";
import EvToolImage from "../../../public/evtool.png";
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
                                    <a href="#" rel="author" className="text-xl font-bold text-gray-900 dark:text-white">Arbster</a>
                                    <p className="text-base font-light text-gray-500 dark:text-gray-400">Arbster Team</p>
                                    <p className="text-base font-light text-gray-500 dark:text-gray-400">Feb. 8, 2022</p>
                                </div>
                            </div>
                        </address>
                        <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                            Using the positive EV tool
                        </h1>
                    </header>
                    <p className="lead">
                    In this blog post, we will be going over the positive EV tool in greater detail and how to use it to find value in your bets.
                    </p>
                    <figure><Image src={EvToolImage} alt="Positive EV diagram" />
                        <figcaption>Screenshot of Arbster's Positive EV Tool</figcaption>
                    </figure>
                    <h3>Match "Indicators" - What do they represent?</h3>
                    <p>
                        This column tells you the win probability for a match. The indicator can be red, yellow or green. A red indicator tells you the win probability is below 35%. A yellow indicator suggests the win probability is between 35% and 60%. A green indicator tells you the win probability is above 60%. The higher the win probability, the more likely it is that the outcome will happen.
                    </p>
                    <p>
                        If you would like a more detailed view of the win probability, you can hover over the indicator to see the exact win probability. 
                    </p>
                    
                    <h3>"Market" column</h3>
                    <p>
                        This column tells you the market you are looking at. This can range from things such as H2H (head-to-head), TOTALS, H2H LAY (head-to-head lay), etc. The normal value you will see in this column is "H2H LAY"
                    </p>
                    <h4>What is a lay bet?</h4>
                    <p>
                    In sports betting, a lay bet is a type of bet where you are betting against a particular outcome, rather than for it. When you place a lay bet, you are essentially acting as the bookmaker, offering odds to other bettors who want to place a traditional "back" bet on the outcome you're betting against.

                    For example, let's say you're betting on a football match and you place a lay bet against Team A winning. This means you win your bet if Team A loses or draws, but you lose your bet if Team A wins. Essentially, you are betting on the other team or a draw to win.

                    Lay betting is often used in sports trading, where bettors are looking to make a profit by backing and laying the same outcome at different odds, effectively "buying low and selling high" to lock in a profit regardless of the actual outcome of the event.
                    </p>

                    <h3>"Bet On" column</h3>
                    <p>
                        This column tells you the outcome to bet on in the given market. For example, it may say "Liverpool" in a match against Manchester United. If the market is H2H LAY This means you should place a lay bet on Liverpool to win.
                    </p>

                    <h3>"Expected Value" column</h3>
                    <p>
                        This column tells you the expected value of the bet. The expected value is the amount of money you can expect to win or lose on average as a percentage of your stake.
                    </p>

                    <h3>"Bookmaker" column</h3>
                    <p>
                        This column shows the bookmaker you should use to place the bet.
                    </p>

                    <h3>"Odds"</h3>
                    <p>
                        This column shows the odds you should use to place the bet. If the odds are not reflected on the bookmakers site, we do not recommend placing the bet. We suggest waiting for the next update of the positive EV tool. These updates occur every 4-5 minutes.
                    </p>
                    
                    <h3>"No-vig odds" column</h3>
                    <p>
                        This column shows the no-vig odds of the outcome. No-vig odds are the odds that a bookmaker would offer if they did not take a cut of the winnings. This is the true predicted odds of the outcome.
                    </p>
                    
                    
                    <h3>"Rec. bet size" column</h3>
                    <p>
                        This column shows the recommended bet size for the bet. This is calculated using the Kelly Criterion. If you're curious about how we calculate this, you can read more about it in our <Link href="/blog/what-is-a-positive-ev-bet">blog post.</Link>
                    </p>  
                    
                    <h3>"Rec. bet size" column</h3>
                    <p>
                        This column allows you to add the bet to our bet tracker to keep a log of your bets. This is useful for keeping track of your bets and for calculating your ROI.
                    </p>  

                    <Link href="/blog"
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        Back To Blog
                    </Link>     
                </article>
                
            </div>
        </main>
    </>
    );
}
