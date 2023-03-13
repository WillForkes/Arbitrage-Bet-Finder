import React from "react";

export default function Hero() {
  return (
    <section className="dark:bg-gray-800 dark:text-gray-100">
      <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center md:py-32 md:px-10 lg:px-32 xl:max-w-3xl">
        <h1 className="text-4xl font-bold leading-none sm:text-5xl">
          Arbitrage Betting made Simple
        </h1>
        <p className="px-8 mt-8 mb-12 text-lg">
          Our tools make the difficult part of finding good bets easy.
        </p>
        <div className="flex flex-wrap justify-center">
          <button className="px-8 py-3 m-2 text-lg font-semibold rounded dark:bg-blue-400 dark:text-gray-900">
            Get started
          </button>
          <button className="px-8 py-3 m-2 text-lg border rounded dark:text-gray-50 dark:border-gray-700">
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}
