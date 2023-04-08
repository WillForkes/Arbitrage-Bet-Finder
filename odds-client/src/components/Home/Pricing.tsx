declare global {
  interface Window {
    Rewardful: any;
  }
}

import { createPayment, createPortal } from "@/api";
import { Plan } from "@/types";
import React, { useContext } from "react";
import { Badge, Tooltip } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import Link from "next/link";
import { HiClock, HiCheck, HiCurrencyPound, HiX } from "react-icons/hi";

export default function Pricing() {
  const user: User | null = useContext(UserContext).user;

  async function subscriptionHandle(plan: string) {
    try {
      const refId = (window.Rewardful && window.Rewardful.referral) || "checkout_" + new Date().getTime();
      let trial = false;

      if (user?.dbuser.trialActivated == false && plan != "plus") {
        trial = true;
      }

      // if user already has plan, get portal link instead
      if (user?.dbuser.plan != "free") {
        const portalRes = await createPortal();
        window.location.assign(portalRes.url);
      } else {
        var response = await createPayment(plan as Plan, refId, trial);
        window.location.assign(response.url);
      }

    } catch (e) {
      console.error(e);
    }
  }

  function getButtonText(plan: string) {
    if (user?.dbuser.plan == plan) {
        return "Current Plan";
    } else if (user?.dbuser.plan == "free" && user?.dbuser.trialActivated == false && plan != "plus") {
        return "Try 5 Days For Free";
    } else if(!user) {
        return "Login To Try For Free";
    } else if(user?.dbuser.plan != "free") {
        return "Change Plan";
    } else {
        return "Buy Now"
    }
  }

  function canActivateTrial() {
    if (user?.dbuser.trialActivated == false || !user) {
      return true;
    } else {
      return false;
    }
  }


  return (
    <section id="pricing" className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-4">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <span className="font-bold tracking-wider uppercase dark:text-primary-700">
            Pricing
          </span>
          <h2 className="text-4xl font-bold lg:text-5xl dark:text-white">
            Bet like a Hedge Fund
          </h2>
        </div>



        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-2 xl:gap-10 lg:space-y-0">
          <div className="flex flex-col p-6  max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            
            <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
              Great for learning the ropes.
            </p>
            <div className="flex justify-center items-baseline my-4">
              <span className="mr-2 text-5xl font-extrabold">£29.99</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>

            {canActivateTrial() ? (
                <div className="flex mb-4 mx-auto flex-wrap gap-2">
                    <Badge icon={HiCheck}>
                        5 Day Free Trial Available
                    </Badge>
                </div>
            ) : null}


            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span className="font-semibold">🔥Arbitrage Tool Access 🔥</span>
              </li>

              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Bet Tracker Tool Access</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>CSV Bet History Exporting</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Access to ALL betting calculators</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>
                  <span >
                    No setup, or hidden fees
                  </span>
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>30 Day money back guarantee</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Email bet notifications</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>Positive EV Tool Access</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>Early access to new features</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>SMS bet notifications</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>Prioritised support</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>
                  <span className="font-semibold">1 On 1</span> Live video call
                  coaching
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>
                  <span className="font-semibold">+5 Bonus entries</span> on
                  every giveaway
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>API Access</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>Free unique tips, tricks and tutorial guides</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>Discord Server Custom Role</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>&gt;10% ROI Bets</span>
                <Tooltip
                    animation="duration-300"
                    content="Bets above 10% ROI are only available to plus members as they disapear quicker when there is a higher volume of users placing the bet."
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4 mt-1 ml-0.5"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    ></path>
                    </svg>
                </Tooltip>
              </li>

            </ul>


            {user ? (
              <button
                onClick={() => subscriptionHandle("starter")}
                className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                disabled={user.dbuser.plan == "starter"}
              >
                {getButtonText("starter")}
              </button>
            ) : (
              <Link
                className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                href="/auth/login"
              >
                {getButtonText("starter")}
              </Link>
            )}
          </div>

          <div className="flex flex-col p-6 max-w-xl text-center text-gray-900 bg-white rounded-lg border border-primary-700 shadow dark:border-primary-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            <h3 className="mb-4 text-2xl font-semibold dark:text-white">
              Pro
            </h3>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
              Our recommended plan.
            </p>
            <div className="flex justify-center items-baseline my-4">
              <span className="mr-2 text-5xl font-extrabold">£49.99</span>
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400">
                /month
              </span>
            </div>

            {canActivateTrial() ? (
                <div className="flex mb-4 mx-auto flex-wrap gap-2">
                    <Badge icon={HiCheck}>
                        5 Day Free Trial Available
                    </Badge>
                </div>
            ) : null}

            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>🔥Arbitrage Tool Access 🔥</span>
              </li>

              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Bet Tracker Tool Access</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>CSV Bet History Exporting</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Access to ALL betting calculators</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>
                  <span >
                    No setup or hidden fees
                  </span>
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>30 Day money back guarantee</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Email bet notifications</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Positive EV Tool Access</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Early access to new features</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>SMS bet notifications</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>Prioritised support</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>
                  <span className="font-semibold">1 On 1</span> Live video call
                  coaching
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>
                  <span className="font-semibold">+5 Bonus entries</span> on
                  every giveaway
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>API Access</span>
              </li>
              
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>Free unique tips, tricks and tutorial guides</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>Discord Server Custom Role</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiX className="dark:text-red-600"/>
                <span>&gt;10% ROI Bets</span>
                <Tooltip
                    animation="duration-300"
                    content="Bets above 10% ROI are only available to plus members as they disapear quicker when there is a higher volume of users placing the bet."
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4 mt-1 ml-0.5"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    ></path>
                    </svg>
                </Tooltip>
              </li>
            </ul>

            {user ? (
              <button
                onClick={() => subscriptionHandle("starter")}
                className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                disabled={user.dbuser.plan == "pro"}
              >
                {getButtonText("pro")}
              </button>
            ) : (
              <Link
                className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                href="/auth/login"
              >
                {getButtonText("pro")}
              </Link>
            )}
          </div>

          <div className="flex flex-col p-6 max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            <h3 className="mb-4 text-2xl font-semibold">Plus</h3>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
              The ultimate plan for experienced users.
            </p>
            <div className="flex justify-center items-baseline my-4">
              <span className="mr-2 text-5xl font-extrabold">£99.99</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>

            {canActivateTrial() ? (
                <div className="flex mb-4 mx-auto flex-wrap gap-2">
                    <Badge icon={HiX}>
                        5 Day Free Trial Available
                    </Badge>
                </div>
            ) : null}

            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>🔥Arbitrage Tool Access 🔥</span>
              </li>

              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Bet Tracker Tool Access</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>CSV Bet History Exporting</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Access to ALL betting calculators</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>
                  <span >
                    No setup, or hidden fees
                  </span>
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>30 Day money back guarantee</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Email bet notifications</span>
              </li>
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Positive EV Tool Access</span>
              </li>
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Early access to new features</span>
              </li>
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>SMS bet notifications</span>
              </li>
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Prioritised support</span>
              </li>
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>
                  <span className="font-semibold">1 On 1</span> Live video call
                  coaching
                </span>
              </li>
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>
                  <span className="font-semibold">+5 Bonus entries</span> on
                  every giveaway
                </span>
              </li>
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>API Access</span>
              </li>
              
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Free unique tips, tricks and tutorial guides</span>
              </li>
              <li className="flex items-center space-x-3">
                                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>Discord Server Custom Role</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
                <span>&gt;10% ROI Bets</span>
                <Tooltip
                    animation="duration-300"
                    content="Bets above 10% ROI are only available to plus members as they disapear quicker when there is a higher volume of users placing the bet.">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4 mt-1 ml-0.5"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    ></path>
                    </svg>
                </Tooltip>
              </li>
              
            </ul>

            {user ? (
              <button
                onClick={() => subscriptionHandle("plus")}
                className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                disabled={user.dbuser.plan == "plus"}
              >
                {getButtonText("plus")}
              </button>
            ) : (
              <Link
                className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                href="/auth/login"
              >
                {getButtonText("plus")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
