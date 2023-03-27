import React from "react";

export default function Features() {
  return (
    <section className="bg-white dark:bg-gray-900">
    <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
        <dl className="grid max-w-screen-md gap-16 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
            <div className="flex flex-col items-center justify-center">
                <dt className="mb-2 text-3xl md:text-4xl font-extrabold">150+</dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">Satisfied Customers</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
                <dt className="mb-2 text-3xl md:text-4xl font-extrabold">50,000+</dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">Sure Bets Found</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
                <dt className="mb-2 text-3xl md:text-4xl font-extrabold">99.9%</dt>
                <dd className="font-light text-gray-500 dark:text-gray-400">Uptime</dd>
            </div>
        </dl>
    </div>
    </section>
  );
}
