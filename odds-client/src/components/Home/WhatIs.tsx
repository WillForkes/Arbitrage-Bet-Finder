import React from "react";
import { Carousel } from "flowbite-react";
import Image from "next/image";
import { Tooltip } from "flowbite-react";
import Img1 from "../../../public/whatis1.jpg";
import Img2 from "../../../public/whatis2.jpg";
import Img3 from "../../../public/whatis3.jpg";
import Img4 from "../../../public/whatis4.jpg";
import HowWorks from "../../../public/how-works.webp";

import Link from "next/link";

export default function Testimonials() {
  return (
    <section className="bg-white dark:bg-gray-800 py-12">
      <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white flex">
            Arbitrage betting <p className="dark: text-primary-700 ml-2"> is not gambling</p>
          </h2>
            <p className="mb-4">Arbster offers a unique approach to sports betting with arbitrage betting, 
            also known as sure betting. Despite the term &quot;betting,&quot; it&apos;s not about gambling. 
            Arbster&apos;s proprietary software identifies bookmakers and matches where sure bets exist, guaranteeing a profit regardless of the outcome. 
            With Arbster, you simply place bets on both sides and let the results follow. 
            It&apos;s a surefire way to make profit from sports betting without relying on luck.
            </p>
            <p className="mb-4">
            At Arbster, we offer cutting-edge tools for sports bettors. Our flagship product, the arbitrage betting tool, uses proven mathematical models and real-time data to identify profitable opportunities. With our arbitrage betting tool, users can bet on both sides of a game with different sportsbooks, guaranteeing a profit. Arbster is your ideal partner for achieving your sports betting goals.            
            </p>
            
            <Link 
            className="float-right text-white bg-gray-700 border dark:border-gray-700 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
            href="/#pricing">Start Your Free Trial Now
            </Link>

        </div>
        <div className="">
            <Image src={HowWorks} alt="office content 1" height={600} className="w-full rounded-lg mt-10"/>
        </div>
      </div>
    </section>
  );
}
