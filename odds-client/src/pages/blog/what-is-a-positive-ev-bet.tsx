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
                        Arbster is a unique and innovative service that caters to the needs of sports bettors who are looking to take advantage of arbitrage betting opportunities in the sports betting market. Our platform provides users with real time analysis of the odds offered by various bookmakers for different events, enabling them to place opposing bets at different bookmakers to guarantee a profit.    
                    </p>
                    <h3>What exactly is arbitrage betting?</h3>
                    <p>
                        Arbitrage betting is a betting strategy that has been used by professional gamblers for decades. However, it requires a significant amount of time, effort, and resources to identify the right opportunities. This is where Arbster comes in. We utilise cutting edge technology and sophisticated algorithms to analyse odds from hundreds of bookmakers worldwide, identifying profitable arbitrage opportunities in real time.
                    </p>
                    <figure><img src="https://www.gamblingsites.org/app/uploads/2018/10/arbitrage-1.jpg" alt="" />
                        <figcaption>Digital art by gamblingsites.org</figcaption>
                    </figure>
                    <h3>How does Arbster help me with arbitrage betting?</h3>
                    <p>
                    At Arbster, we understand that our users are looking for a reliable, accurate, and user friendly service that can help them make the most out of their sports betting experience. We are committed to providing our users with a seamless and hassle free experience, making it easy for them to take advantage of arbitrage betting opportunities and increase their chances of winning.
                    </p>
                    <p>
                    Our team of experts is dedicated to constantly updating our platform with the latest tools and market trends, ensuring that our users have access to the most up-to-date information. We pride ourselves on our exceptional customer service, and our team is always on hand to answer any questions or concerns our users may have.
                    </p>
                    <p>
                        Whether you are a seasoned professional or a newcomer to the world of sports betting, Arbster is the perfect platform for anyone looking to take their betting experience to the next level. With our cutting edge technology, real time analysis, and exceptional customer service, we are committed to providing our users with a reliable service that helps them make the most out of their sports betting experience.
                    </p>
                    
                    <h2>TL;DR</h2>
                    <p>For those who don’t have time to read the whole article, here’s the gist:</p>
                    <ol>
                        <li><strong>We do the hard work</strong>. 
                            Sit back and relax while our service with it's sophisticated algorithms analyze odds 
                            from over 80 bookmakers worldwide, uncovering profitable arbitrage opportunities in real time so you can 
                            make easy profits without the hassle.
                        </li>
                        <li><strong>Reliable and fast</strong>. Don't miss out on any lucrative betting opportunities with our reliable and lightning-fast service that provides 
                        real-time analysis of odds, ensuring you stay ahead of the game and capitalize on favorable odds.</li>
                        <li><strong>Worldwide</strong>. Our platform covers bookmakers from 4 continents, 
                        giving you a global edge and access to a wide range of sports and events for arbitrage betting, 
                        no matter where you are in the world.</li>
                        <li><strong>Keeping track</strong>. Stay on top of your game with our bet tracking tools and analysis, 
                        helping you keep track of your bets, profits, and performance, 
                        so you can make informed decisions and keep your winning streak going.
                        </li>
                    </ol>
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
