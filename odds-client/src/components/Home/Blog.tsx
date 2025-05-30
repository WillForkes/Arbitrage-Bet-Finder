import React, { useContext } from "react";
import { Badge, Tooltip } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import Link from "next/link";
import { User } from "@/types";
import Image from "next/image";
import Logo from "../../../public/arbster.png";
import { AlertContext } from "@/pages/_app";

export default function Blog() {
    const user: User | null = useContext(UserContext).user;
    const alertContext = useContext(AlertContext);

  return ( 
    <section id="blog"  className="bg-white dark:bg-gray-800 pt-8">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                <span className="font-bold tracking-wider uppercase dark:text-primary-700">
                    Information
                </span>
                <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">How do I make money with Arbster?</h2>
                <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">A great place to start before diving in.</p>
            </div> 
            <div className="grid gap-8 lg:grid-cols-2">
                <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-5 text-gray-500">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                            <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                            Tutorial
                        </span>
                        <span className="text-sm">Beginner</span>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">How does Arbster work?</a></h2>
                    <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                        Get a quick overview of how Arbster works through our concise video. Learn about our cutting-edge approach that combines statistics, machine learning, and risk management algorithms to uncover sure bets and positive expected value (EV) opportunities. Discover the advanced techniques used by Arbster to help you make informed betting decisions and maximize your profits. Watch the video now and unlock the potential of Arbster for your betting success.                </p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Image className="w-7 h-7 rounded-full" src={Logo} alt="Arbster logo" />
                            <span className="font-medium dark:text-white">
                                Arbster
                            </span>
                        </div>
                        <Link href="/blog/how-does-arbster-work" className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                            Read more
                            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </Link>
                    </div>
                </article> 
                <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-5 text-gray-500">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                            <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"></path><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path></svg>
                            Tutorial
                        </span>
                        <span className="text-sm">Beginner</span>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">Learn how Arbitrage Betting works</a></h2>
                    <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                    Discover the secrets of arbitrage betting in our comprehensive guide. Learn how to make guaranteed profits by capitalizing on differing odds across multiple bookmakers, complete with examples, analogies, and formulas. This blog post is targeted at newcomers to the arbitrage market to help you get to grips with the underlying knowledge of how Arbster works. Unleash the potential of this low-risk betting strategy and start earning today!
                    </p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Image className="w-7 h-7 rounded-full" src={Logo} alt="Arbster logo" />
                            <span className="font-medium dark:text-white">
                                Arbster
                            </span>
                        </div>
                        <Link href="/blog/learn-how-arbitrage-works" className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                            Read more
                            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </Link>
                    </div>
                </article>
            </div> 
        </div>
        <div className="mx-auto max-w-screen-sm text-center pb-16">
            <Link
                className="text-white bg-gray-700 border dark:border-gray-700 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                href="/blog"
                >
                See More
            </Link>
        </div> 
    </section>
  );
}

