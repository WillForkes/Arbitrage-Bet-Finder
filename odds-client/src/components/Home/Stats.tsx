import React from "react";

export default function Features() {
  return (
    <section className="bg-white dark:bg-gray-900 pb-16">
        <div className="max-w-screen-xl px-4  mx-auto text-center lg:px-4">
            <dl className="grid max-w-screen-md gap-16 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
                <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl md:text-4xl font-extrabold">80%+</dt>
                    <dd className="font-light text-gray-500 dark:text-gray-400">Satisfaction Rate</dd>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <dt className="mb-2 text-3xl md:text-4xl font-extrabold">100,000+</dt>
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
