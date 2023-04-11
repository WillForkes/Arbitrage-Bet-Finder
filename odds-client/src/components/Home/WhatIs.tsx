import React from "react";
import { Carousel } from "flowbite-react";
import Image from "next/image";
import { Tooltip } from "flowbite-react";
import Img1 from "../../../public/whatis1.jpg";
import Img2 from "../../../public/whatis2.jpg";
import Img3 from "../../../public/whatis3.jpg";
import Img4 from "../../../public/whatis4.jpg";

export default function Testimonials() {
  return (
    <section className="bg-white dark:bg-gray-800 py-12">
      <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            We didn&apos;t reinvent the wheel
          </h2>

            <p className="mb-4">
            At Arbster, we are passionate about providing sports bettors with the tools they need to succeed in the world of sports betting. Our flagship products, the arbitrage betting tool and the positive EV betting tool, are designed to help our users identify profitable betting opportunities.
            </p>
            <p className="mb-4">
            Using proven mathematical models and real-time data, our arbitrage betting tool scans various sportsbooks to find discrepancies in the odds. By betting on both sides of a game with different sportsbooks, our users can guarantee a profit. This powerful tool has helped our users generate consistent profits and is a key reason why Arbster is a leading name in the world of sports betting.
            </p>
            <p className="mb-4">
            Our positive EV betting tool is designed to identify situations where the odds offered by a sportsbook are better than the true odds of an event occurring. By placing bets in these situations, our users can achieve a positive expected value (EV) and generate profits over the long term.
            </p>
            <p>
            At Arbster, we are committed to providing our users with the best possible tools for sports betting. Whether you are a seasoned bettor or just starting out, our innovative platform and unwavering commitment to excellence make us the perfect partner to help you achieve your sports betting objectives.
            </p>
        </div>
        <div className="">
            <Image src={Img4} alt="office content 1" height={500} className="w-full rounded-lg mt-10"/>
          {/* <img
            height={100}
            width={100}
            className="w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
            alt="office content 1"
          />
          <img
            height={100}
            width={100}
            className="mt-4 w-full lg:mt-10 rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
            alt="office content 2"
          /> */}
        </div>
      </div>
    </section>
  );
}
