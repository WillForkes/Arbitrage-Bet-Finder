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
                                    <a href="#" rel="author" className="text-xl font-bold text-gray-900 dark:text-white">Arbster</a>
                                    <p className="text-base font-light text-gray-500 dark:text-gray-400">Arbster Team</p>
                                    <p className="text-base font-light text-gray-500 dark:text-gray-400">Feb. 8, 2022</p>
                                </div>
                            </div>
                        </address>
                        <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                            What is a positive EV bet?
                        </h1>
                    </header>
                    <p className="lead">
                    Are you looking to increase your chances of winning in sports betting? Look no further! In this blog post, we will delve into the concept of positive Expected Value (EV) betting - what it is, how it works, and how you can benefit from it. Get ready to level up your betting game and boost your chances of making a profit with this powerful strategy!
                    </p>
                    <figure><img src="https://i0.wp.com/caanberry.com/wp-content/uploads/2023/01/positive-expected-values-betting.jpg" alt="" />
                        <figcaption>Digital art by Caan Berry</figcaption>
                    </figure>
                    <h3>What is a positive EV bet?</h3>
                    <p>
                        Put simply, it’s basically where you think the sportsbook has undervalued its odds and therefore you will be able to get improved returns. 
                    </p>
                    <p>
                        In more complex terms, positive EV betting is when you place a bet that has a higher potential payout than the likelihood of the event occurring. This means that over the long run, you can expect to make a profit by consistently making positive EV bets. To better help you understand what it is, lets look at some examples:
                    </p>

                    <h3>It's all about the long run</h3>
                    <p>
                        Is not about winning every single bet, but rather about playing the long game. It's a strategic approach where you focus on making bets that have a higher potential payout than the likelihood of the event occurring. In other words, it's about finding value in your bets and capitalizing on it over time. Therefore we suggest a few things:
                    </p>
                    <ul>
                        <li>Don't expect instant returns</li>
                        <li>If you want to play it safe, bet on matches with a green indicator next to them, suggesting a higher win probability</li>
                        <li>Use our bet tracker to keep a log of your bets</li>
                        <li>Utilise risk management strategies such as our in-built recommended bet sizing</li>
                        <li>Trust the process</li>
                    </ul>

                    <h3>Simple Example 1</h3>
                    <figure><img src="https://www.vertica.com/wp-content/uploads/2019/07/Coin_Flip_183981489-2160.jpg" alt="" />
                        <figcaption>Digital art by Vertica</figcaption>
                    </figure>
                    <p>
                        For instance, if you bet on a coin flip with a 60% chance of landing heads, and the payout for a win is £20 while the bet is £10, this is a positive EV bet. Although you might not win every time, making positive EV bets gives you an advantage in the long run and increases your chances of making a profit while minimising losses.
                    </p>

                    <h3>Simple Example 2</h3>
                    <p>
                        Let's say you're betting on a basketball game, and the bookmakers offer odds of 2.00 for Team A to win and odds of 3.50 for Team B to win. However, you believe that Team A has a better chance of winning based on your analysis. If you place a bet on Team A and they win, you have made a positive EV bet. This means you took advantage of the higher payout compared to the perceived likelihood of the event, potentially resulting in a profitable outcome.
                    </p>

                    <h3>How do we recommend bet sizes?</h3>
                    <p>
                        We recommend bet sizes based on your bankroll and the odds of the bet using a mathmatical formula named the <a href="https://en.wikipedia.org/wiki/Kelly_criterion">Kelly Criterion</a>. This formula is used to determine the optimal bet size for a given bet, based on the probability of winning and the odds of the bet.                        
                    </p>

                    <h3>How do we calculate expected value?</h3>
                    <p>
                    The formula for expected value is. This is the formula in the OddsJam sports betting expected value calculator.
                    </p>
                    <pre>
                        <code className="grid grid-cols-2 gap-8 max-w-screen-md text-gray-900 sm:grid-cols-3 dark:text-white language-html">
                            (fair win probability) x (profit if win) - (fair loss probability) x (stake)
                        </code>
                    </pre>  
                    
                    <h3>Fair win probability?</h3>
                    <p>
                    You may be thinking, how do we calculate the fair win probability of a match? Well, the answer is simpler than you may think! 
                    </p>  
                    <p>
                        We first accumulate all the odds from the bookmakers we cover and use these to mathmatically remove the bookmakers fee (vigorish, hence the term: No-vig odds) for each bookie, and then we average them out. This gives us the average true odds for a match. which we can then use in the formula above to calculate the expected value.
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
