import React, { useState } from "react";
import Image from "next/image";
import { Accordion } from "flowbite-react";

export default function FAQ() {
  return (
    <>
        <section className="bg-white dark:bg-gray-900">
        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">We didn't reinvent the wheel</h2>
                    <p className="mb-4">
                    Instead, we use provable math and statistics to help you make the most of arbitrage and sports betting. Our platform systematically scans hundreds of bookmakers to find the best odds available, allowing you to identify and capitalize on arbitrage opportunities. Our calculations are based on proven mathematical models and statistical analysis, ensuring that you can make informed decisions and secure a healthy profit.
                    </p>
                    <p>
                    With our platform, you can rest assured that your bets are based on sound mathematical principles, giving you the edge you need to succeed in the worlds of arbitrage and positive EV betting. 
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <img height={100} width={100} className="w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png" alt="office content 1" />
                    <img height={100} width={100} className="mt-4 w-full lg:mt-10 rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png" alt="office content 2" />
                </div>
            </div>

            <div className="mx-auto max-w-screen-lg">
                <Accordion>
                    <Accordion.Panel>
                        <Accordion.Title>
                        What is arbitrage betting?
                        </Accordion.Title>
                        <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Arbitrage betting, also known as sure betting or miraclebetting, is a betting strategy that involves placing bets on all possible outcomes of a sporting event or a market, in order to ensure a profit regardless of the outcome. It requires finding and exploiting discrepancies in odds offered by different bookmakers.
                            </p>
                        </Accordion.Content>
                    </Accordion.Panel>

                    <Accordion.Panel>
                        <Accordion.Title>
                        What is an Arbitrage betting service?
                        </Accordion.Title>
                        <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                            An arbitrage betting service is a tool that helps bettors to identify arbitrage opportunities quickly and efficiently. The service scans different bookmakers' odds and identifies situations where the combined odds for all possible outcomes of an event are lower than 100%, which means a guaranteed profit can be made. 
                            </p>
                        </Accordion.Content>
                    </Accordion.Panel>

                    <Accordion.Panel>
                        <Accordion.Title>
                        How does Arbster work?
                        </Accordion.Title>
                        <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Our arbitrage betting service uses advanced algorithms to scan and compare odds from multiple bookmakers in real-time. It identifies any discrepancies and highlights profitable opportunities. It is extremely beginner friendly and can obtain very large amounts of profit. 
                            </p>
                        </Accordion.Content>
                    </Accordion.Panel>

                    <Accordion.Panel>
                        <Accordion.Title>
                        How is Arbster different from others on the market?
                        </Accordion.Title>
                        <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Our arbitrage betting service is competitively priced and has better functionality compared to many other arbitrage betting services. We continuously update our service to ensure it remains cutting-edge and effective. We also provide excellent customer support and assistance to our clients. 
                            </p>
                        </Accordion.Content>
                    </Accordion.Panel>

                    <Accordion.Panel>
                        <Accordion.Title>
                        Is arbitrage betting legal?
                        </Accordion.Title>
                        <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Yes, arbitrage betting is legal in most countries. However, some bookmakers may not allow it, and it is important to check the terms and conditions of each bookmaker before placing bets. We do not condone any illegal or unethical activity related to arbitrage betting.
                            </p>
                        </Accordion.Content>
                    </Accordion.Panel>

                    <Accordion.Panel>
                        <Accordion.Title>
                        Is your service suitable for beginners?
                        </Accordion.Title>
                        <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Yes, our service is user-friendly and easy to use, making it suitable for beginners. We also provide comprehensive tutorials and support to help users get started with arbitrage betting. 
                            </p>
                        </Accordion.Content>
                    </Accordion.Panel>

                    <Accordion.Panel>
                        <Accordion.Title>
                        Can your service guarantee a profit?
                        </Accordion.Title>
                        <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                            (Yes, when used correctly.) While our service can identify profitable opportunities, we cannot guarantee a profit. The success of arbitrage betting depends on many factors, including the odds offered by bookmakers, the size of the bets, and the fees charged by payment processors. It is important to understand the risks involved and to bet responsibly. 
                            </p>
                        </Accordion.Content>
                    </Accordion.Panel>

                    <Accordion.Panel>
                        <Accordion.Title>
                        Do you offer a free trial?
                        </Accordion.Title>
                        <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Yes, we offer a free trial of our arbitrage betting service for a limited period of time. This allows potential clients to test the software and see its effectiveness before making a purchase. Get your free trial here -> http://arbster.com/ 
                            </p>
                        </Accordion.Content>
                    </Accordion.Panel>

                    
                </Accordion>
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
