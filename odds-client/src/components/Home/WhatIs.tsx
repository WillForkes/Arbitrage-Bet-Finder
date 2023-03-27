import React from "react";
import { Carousel } from "flowbite-react";
import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            We didn&apos;t reinvent the wheel
          </h2>
          <p className="mb-4">
            Instead, we use provable math and statistics to help you make the
            most of sports betting. Our platform systematically scans hundreds
            of bookmakers to find the best odds available, allowing you to
            identify and capitalize on arbitrage and positive EV opportunities.
            Our calculations are based on proven mathematical models and
            statistical analysis, ensuring that you can make informed decisions
            and secure a healthy profit.
          </p>
          <p>
            With our platform, you can rest assured that your bets are based on
            sound mathematical principles, giving you the edge you need to
            succeed in the worlds of arbitrage and positive EV betting.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <img
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
          />
        </div>
      </div>
    </section>
  );
}
