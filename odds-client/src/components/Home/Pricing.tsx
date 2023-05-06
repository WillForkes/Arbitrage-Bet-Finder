declare global {
  interface Window {
    Rewardful: any;
  }
}

import { createPayment, createPaypalPayment } from "@/api";
import { Plan } from "@/types";
import React, { useContext, useState } from "react";
import { Badge, Tooltip } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import Link from "next/link";
import { Card } from "flowbite-react";

export default function Pricing() {
  const user: User | null = useContext(UserContext).user;
  const [modal, setModal] = useState(false);
  const [plan, setPlan] = useState("starter");

  async function subscriptionHandle(
    plan: string,
    trial: boolean = false,
    withBuyItNowDiscount: boolean = false
  ) {
    try {
        // if user already has plan, get portal link instead
        if(trial) {
            plan = plan + "_trial"
        }
        
        var response = await createPaypalPayment(
            plan as Plan,
            trial,
            withBuyItNowDiscount
        );
        console.log(response.links[0].href);
        window.location.assign(response.links[0].href);
    } catch (e) {
        console.error(e);
    }
  }

  function getButtonText(plan: string) {
    if (canActivateTrial()) {
      return "Try It For Free";
    } else if (user?.dbuser.plan == plan) {
      return "Current Plan";
    } else if (user?.dbuser.plan != "free") {
      return "Change Plan";
    } else {
      return "Buy Now";
    }
  }

  function canActivateTrial() {
    if (user?.dbuser.trialActivated == false && user?.dbuser.plan != "free") {
        return false; // user bought for the discounted price
    }

    if (user?.dbuser.trialActivated == false || !user) {
        return true;
    } else {
        return false;
    }
  }

  function getButtons(plan: string) {
    if (canActivateTrial()) {
      return (
        <>
          <div className="items-center mx-auto max-w-full">
            <button
              onClick={() => {
                subscriptionHandle(plan, true);
              }}
              className="text-white mr-2  dark:focus:ring-primary-900 bg-gray-600 hover:bg-gray-400 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-8 py-2.5 text-center dark:text-white "
              disabled={user?.dbuser.plan == plan}
            >
              {getButtonText(plan)}
            </button>
            <span className="mr-2">Or</span>
            <button
              onClick={() => {
                subscriptionHandle(plan, false, true);
              }}
              className="bg-main-600 hover:bg-main-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-primary-900"
              disabled={user?.dbuser.plan == plan}
            >
              Buy Now (15% Off)
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <button
            onClick={() => {
              subscriptionHandle(plan, false);
            }}
            className="text-white bg-main-600 hover:bg-main-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
            disabled={user?.dbuser.plan == plan}
          >
            {getButtonText(plan)}
          </button>
        </>
      );
    }
  }

  function getCheckHTML(tick = true) {
    if (tick) {
      return (
        <svg
          className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  }

  return (
    <section id="pricing" className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-lg lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <span className="font-bold tracking-wider uppercase dark:text-primary-700">
            Pricing
          </span>
          <h2 className="text-4xl font-bold lg:text-5xl dark:text-white">
            Bet like a Hedge Fund
          </h2>

          {/* Span badge with dashed border containing "BETARELEASE" 10% off code */}
          <div className="mx-auto flex justify-center items-baseline my-4 max-w-md ">
            <span className="mr-2 text-2xl font-extrabold fire-glow-animation">
              BETA RELEASE SALE
            </span>
            <span className="flex mr-2 text-2xl font-semibold fire-glow-animation">
              Ends 20th May
            </span>
          </div>
        </div>

        <div className="max-w-full lg:grid lg:grid-cols-2 sm:space-y-4 lg:space-y-0">
          <div className="max-w-md mx-auto lg:mx-0">
            <Card>
              <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                Starter plan
              </h5>

              <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-semibold">£</span>
                <span className="text-5xl font-extrabold tracking-tight">
                  19
                </span>
                <span className="text-xl font-extrabold tracking-tight">
                  .99
                </span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                  /month
                </span>
                <p className="text-xl font-semibold text-gray-600 ml-4">
                  <s>£29.99</s>
                </p>
              </div>
              <ul role="list" className="my-7 space-y-5">
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    Arbitrage Tool Access
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    Bet Tracker Tool Access
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    CSV Bet History Exporting
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    Email Bet Notifications
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    +5 Bonus Entries On Every Giveaway
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML(false)}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    SMS bet notifications
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML(false)}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    &gt;10% ROI Bets
                  </span>
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
                <li className="flex space-x-3">
                  {getCheckHTML(false)}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    SMS bet notifications
                  </span>
                </li>
              </ul>
              {user ? (
                getButtons("starter")
              ) : (
                <Link
                  className="text-white bg-main-600 hover:bg-main-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                  href="/auth/login"
                >
                  {getButtonText("starter")}
                </Link>
              )}
            </Card>
          </div>

          <div className="max-w-md mx-auto lg:mx-0 border rounded-md border-primary-700 shadow dark:border-primary-600  shadow-primary-700">
            <Card>
              <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                Pro plan
              </h5>

              <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-semibold">£</span>
                <span className="text-5xl font-extrabold tracking-tight">
                  39
                </span>
                <span className="text-xl font-extrabold tracking-tight">
                  .99
                </span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                  /month
                </span>
                <p className="text-xl font-semibold text-gray-600 ml-4">
                  <s>£49.99</s>
                </p>
              </div>
              <ul role="list" className="my-7 space-y-5">
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    Arbitrage Tool Access
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    Bet Tracker Tool Access
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    CSV Bet History Exporting
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    Email Bet Notifications
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    +5 Bonus Entries On Every Giveaway
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    SMS bet notifications
                  </span>
                </li>
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    &gt;10% ROI Bets
                  </span>
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
                <li className="flex space-x-3">
                  {getCheckHTML()}

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    SMS bet notifications
                  </span>
                </li>
              </ul>
              {user ? (
                getButtons("pro")
              ) : (
                <Link
                  className="text-white bg-main-600 hover:bg-main-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                  href="/auth/login"
                >
                  {getButtonText("pro")}
                </Link>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
