import { useRouter } from "next/router";
import React from "react";
import { Timeline as FlowbiteFlowbiteTimeline } from "flowbite-react";
import {HiCalendar} from "react-icons/hi";
export default function FlowbiteTimeline() {
  return (
    <section className="bg-white dark:bg-gray-800 p-16">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <span className="font-bold tracking-wider uppercase dark:text-primary-700">
            Timeline
            </span>
            <h2 className="text-4xl font-bold lg:text-5xl dark:text-white">
            What we have planned
            </h2>
        </div>


    <ol className="items-center sm:flex">
    <li className="relative mb-6 sm:mb-0">
        <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white dark:bg-green-500 sm:ring-8 dark:ring-gray-900 shrink-0"></div>
            <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        </div>
        <div className="mt-3 sm:pr-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Beta</h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on December 23, 2021</time>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">Featuring exclusive discounts and access to new features, was a significant milestone for our company. We"re grateful for the valuable feedback from our early adopters, helping us enhance our offering.</p>
        </div>
    </li>
    <li className="relative mb-6 sm:mb-0">
        <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white dark:bg-green-500 sm:ring-8 dark:ring-gray-900 shrink-0"></div>
            <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        </div>
        <div className="mt-3 sm:pr-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Public</h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on December 23, 2021</time>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">During which we plan to introduce new and refined features, as well as partnerships and an affiliate system. This next phase of development reflects our continued commitment to delivering innovative solutions to our customers and expanding our reach in the industry.</p>
        </div>
    </li>
    <li className="relative mb-6 sm:mb-0">
        <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                <svg aria-hidden="true" className="w-3 h-3 text-blue-800 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
            </div>
            <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        </div>
        <div className="mt-3 sm:pr-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scale</h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on January 5, 2022</time>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">In the subsequent two months, we will be focused on scaling our operations and improving the overall user experience. We recognize the importance of investing in our platform to accommodate the growing demand for our services and continue to deliver exceptional value to our users. As we move forward, we remain dedicated to maintaining the high standards that have defined our business from the beginning.</p>
        </div>
    </li>
</ol>

    </section>
  );
}
