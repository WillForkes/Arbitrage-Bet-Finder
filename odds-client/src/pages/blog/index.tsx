import React, { useContext } from "react";
import { Badge, Tooltip } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/arbster.png";
import Head from "next/head";

export default function Blog() {
    const blogs = [
        {
            title: "How does Arbster work?",
            description: "Get a quick overview of how Arbster works through our concise video. Learn about our cutting-edge approach that combines statistics, machine learning, and risk management algorithms to uncover sure bets and positive expected value (EV) opportunities. Discover the advanced techniques used by Arbster to help you make informed betting decisions and maximize your profits. Watch the video now and unlock the potential of Arbster for your betting success.",
            type: "Introduction",
            difficulty: "Beginner",
            link: "/blog/how-does-arbster-work"
        },
        {
            title: "Using our arbitrage and positive EV tool",
            description: "Discover how to effectively utilize Arbster&quot;s arbitrage and positive expected value (EV) tools with our comprehensive tutorial and straightforward explanations. Whether you&quot;re a beginner or new to Arbster, our step-by-step guide will provide you with the knowledge and skills needed to leverage these powerful tools for profitable betting strategies. Say goodbye to confusion and hello to confident betting with Arbster.",
            type: "Introduction",
            difficulty: "Beginner",
            link: "/blog/using-arbitrage-and-positive-ev-tool"
        },
        {
            title: "What is a positive EV bet?",
            description: "In this blog post, we will explore the concept of positive Expected Value (EV) betting, where you place bets with higher potential payouts than the event's likelihood of occurring. This strategy can lead to long-term profits by consistently making such bets. We will discuss how positive EV bets give you an advantage, increase your chances of making a profit, and suggest arbitrage betting as a no-risk strategy for maximizing positive EV bets.",
            type: "Information",
            difficulty: "Intermediate",
            link: "/blog/what-is-a-positive-ev-bet"
        },
        
    ]
  return (
    <section id="blog"  className="bg-white dark:bg-gray-900 pt-8">
        <Head>
            <title>Arbster | Blog</title>
            <meta name="description" content="Arbster's blog repository containing everything you need to know about our website and how to use our range of tools" />
        </Head>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
            {blogs.map((blog) => (
                <article key={blog.title} className="mb-4 p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-5 text-gray-500">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                            <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"></path><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path></svg>
                            {blog.type}
                        </span>
                        <span className="text-sm">{blog.difficulty}</span>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><Link href={blog.link}>{blog.title}</Link></h2>
                    <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                        {blog.description}
                    </p>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Image className="w-7 h-7 rounded-full" src={Logo} alt="Arbster logo" />
                            <span className="font-medium dark:text-white">
                                Arbster
                            </span>
                        </div>
                        <Link href={blog.link} className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                            Read
                            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </Link>
                    </div>
                </article> 
            ))}

        </div> 
    </section>
  );
}