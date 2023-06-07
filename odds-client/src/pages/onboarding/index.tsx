import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import {
  Modal,
  Alert,
  Badge,
  Card,
  Progress,
  Toast,
  Button,
  Timeline,
} from "flowbite-react";
import {
  HiArrowNarrowRight,
  HiCalendar,
  HiCheck,
  HiInformationCircle,
  HiEye,
} from "react-icons/hi";
import { cookies } from "next/headers";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import internal from "stream";
import HowDoesArbsterWork from "../blog/how-does-arbster-work";
import useSWR from "swr";
import { getter } from "@/api";
import { getBookmakerLogo } from "@/utils";

export default function Onboarding() {
  let [stage1, setStage1] = useState(false);
  let [stage2, setStage2] = useState(false);
  let [stage3, setStage3] = useState(false);
  const [percentProgress, setPercentProgress] = useState(0);
  const [showTempMsg, setShowTempMsg] = useState(false);
  const { data, error } = useSWR("/scraper/signupDeals", getter, {
    refreshInterval: 10000,
  });
  var deals = [];
  if (data && !error) {
    deals = data;
    console.log(data);
  }

  let prog = setupCookies();
  useEffect(() => {
    setStage1(prog[0]);
    setStage2(prog[1]);
    setStage3(prog[2]);

    setPercentProgress(prog.filter((x) => x == true).length * 33.33);
  }, []);

  function setupCookies(): boolean[] {
    const cookies = getCookie("onboarding");
    let retcook;

    if (cookies == undefined) {
      setCookie("onboarding", "1:0|2:0|3:0");
      retcook = "1:0|2:0|3:0";
    } else {
      retcook = cookies;
    }
    retcook = retcook.toString();

    const onboardingProgress = retcook.split("|");
    const prog = [
      onboardingProgress[0].split(":")[1] == "1",
      onboardingProgress[1].split(":")[1] == "1",
      onboardingProgress[2].split(":")[1] == "1",
    ];
    return prog;
  }

  function redirect(link: string) {
    window.open(link, "_blank");
  }

  function updateStore(stage: number) {
    // update cookie
    let toSet = getCookie("onboarding");
    if (toSet == undefined) {
      console.log("Error updating onboarding cookie");
    } else {
      toSet = toSet.toString();
      const onboardingProgress = toSet.split("|");
      onboardingProgress[stage - 1] = stage + ":1";
      toSet = onboardingProgress.join("|");
      setPercentProgress(percentProgress + 33.33);
      setCookie("onboarding", toSet);
    }
  }

  return (
    <>
      <Head>
        <title>Arbster | Onboarding</title>
        <meta
          name="description"
          content="A list of our most frequently asked questions on Arbster"
        />
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="md:flex h-full w-5/6 mx-auto">
          <div className="md:w-1/2 md:mx-10">
            <Card className="bg-white dark:bg-gray-700">
              <Timeline>
                <Timeline.Item>
                  <Timeline.Point icon={stage1 ? HiCheck : HiCalendar} />
                  <Timeline.Content>
                    <Timeline.Time>Stage 1</Timeline.Time>
                    <Timeline.Title>
                      Learn what arbitrage betting is
                    </Timeline.Title>
                    <Timeline.Body>
                      If you are new to arbitrage betting, we recommend you read
                      our blog post on the subject. It will give you a good
                      understanding of what arbitrage betting is and how it
                      works. Make sure to turn on bet notifications so you
                      don&apos;t miss out!
                    </Timeline.Body>
                    <div className="flex flex-row">
                      <Button
                        color="gray"
                        onClick={() => {
                          window
                            .open(
                              "https://www.arbster.com/blog/learn-how-arbitrage-works",
                              "_blank"
                            )
                            ?.focus();
                        }}
                      >
                        Learn Now
                        <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                      </Button>
                      <Button
                        disabled={stage1}
                        className="ml-2"
                        color={stage1 ? `green` : `blue`}
                        onClick={() => {
                          setStage1(true);
                          updateStore(1);
                        }}
                      >
                        Completed
                        <HiCheck className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </Timeline.Content>
                </Timeline.Item>
                <Timeline.Item>
                  <Timeline.Point icon={stage2 ? HiCheck : HiCalendar} />
                  <Timeline.Content>
                    <Timeline.Time>Stage 2</Timeline.Time>
                    <Timeline.Title>
                      Signup and whitelist bookmakers
                    </Timeline.Title>
                    <Timeline.Body>
                      Whitelisting bookmakers in your settings will only show
                      bets which are availble to you. You can whitelist
                      bookmakers in the settings page.
                    </Timeline.Body>
                    <div className="flex flex-row">
                      <Button
                        color="gray"
                        onClick={() => {
                          window.location.href =
                            "https://www.arbster.com/profile";
                        }}
                      >
                        Do now
                        <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                      </Button>
                      <Button
                        disabled={stage2}
                        className="ml-2"
                        color={stage2 ? `green` : `blue`}
                        onClick={() => {
                          setStage2(true);
                          updateStore(2);
                        }}
                      >
                        Completed
                        <HiCheck className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </Timeline.Content>
                </Timeline.Item>
                <Timeline.Item>
                  <Timeline.Point icon={stage3 ? HiCheck : HiCalendar} />
                  <Timeline.Content>
                    <Timeline.Time>Stage 3</Timeline.Time>
                    <Timeline.Title>Place your first bet</Timeline.Title>
                    <Timeline.Body>
                      Now that you have whitelisted bookmakers, you can place
                      your first bet. This is the fun part.
                    </Timeline.Body>
                    <div className="flex flex-row">
                      <Button
                        color="gray"
                        onClick={() => {
                          window.location.href =
                            "https://www.arbster.com/scraper/bets";
                        }}
                      >
                        Find bets
                        <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                      </Button>
                      <Button
                        disabled={stage3}
                        className="ml-2"
                        color={stage3 ? `green` : `blue`}
                        onClick={() => {
                          setStage3(true);
                          updateStore(3);
                        }}
                      >
                        Completed
                        <HiCheck className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </Timeline.Content>
                </Timeline.Item>
              </Timeline>

              <span className="font-bold tracking-wider dark:text-white">
                🎉 Now go make some money! Got any questions,{" "}
                <Link
                  href=""
                  className="text-teal-400 underline hover:cursor-pointer"
                >
                  join our discord community
                </Link>{" "}
                and ask away!
              </span>
            </Card>
          </div>
          <div className="flex flex-col md:w-1/2">
            <Card className="bg-white dark:bg-gray-700">
              <div className="flex flex-row">
                <div className="text-base font-medium mr-2">
                  Onboarding progress ({percentProgress.toFixed(0)}%)
                </div>
                <Badge
                  color={
                    percentProgress == 0
                      ? `gray`
                      : percentProgress > 99
                      ? `green`
                      : `blue`
                  }
                  size="sm"
                >
                  {percentProgress == 0
                    ? `Not started`
                    : percentProgress > 99
                    ? `Completed`
                    : `Almost there!`}
                </Badge>
              </div>
              <Progress
                progress={percentProgress == 0 ? 1 : percentProgress}
                color={
                  percentProgress == 0
                    ? `gray`
                    : percentProgress > 99
                    ? `green`
                    : `blue`
                }
              />
            </Card>

            <Card className="bg-white dark:bg-gray-700 mt-5">
              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Bookmaker signup deals
                  </h5>
                </div>
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="py-3 sm:py-4">
                      {deals.length > 0 && !error
                        ? deals.map(
                            (deal: {
                              id: number;
                              name: string;
                              deal: string;
                              link: string;
                              expiresAt: string;
                            }) => (
                              <div
                                key={deal.id}
                                className="flex items-center space-x-4"
                              >
                                <div className="shrink-0">
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={getBookmakerLogo(
                                      deal ? deal.name : ""
                                    )}
                                    alt="Bookmaker image"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {deal.name}
                                  </p>
                                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                    {deal.deal}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => redirect(deal.link)}
                                  color="indigo"
                                >
                                  Get deal
                                </Button>
                              </div>
                            )
                          )
                        : null}
                      {showTempMsg && (
                        <Alert
                          color="success"
                          rounded={false}
                          withBorderAccent={true}
                          onDismiss={() => {
                            setShowTempMsg(false);
                          }}
                          additionalContent={
                            <React.Fragment>
                              <div className="mt-2 mb-4 text-sm text-green-700 dark:text-green-800">
                                We will soon be introducing the opportunity for
                                new users to get fantastic signups deals to
                                bookmakers to help kickstart their arbitrage
                                journey.
                              </div>
                              <div className="flex">
                                <button
                                  onClick={() => {
                                    window.location.href =
                                      "https://discord.gg/YBgmG2gzne";
                                  }}
                                  type="button"
                                  className="mr-2 inline-flex items-center rounded-lg bg-green-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-800 dark:hover:bg-green-900"
                                >
                                  <HiEye className="-ml-0.5 mr-2 h-4 w-4" />
                                  Join the discord
                                </button>
                                <button
                                  onClick={() => {
                                    setShowTempMsg(false);
                                  }}
                                  type="button"
                                  className="rounded-lg border border-green-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 dark:border-green-800 dark:text-green-800 dark:hover:text-white"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </React.Fragment>
                          }
                          icon={HiInformationCircle}
                        >
                          <h3 className="text-lg font-medium text-green-700 dark:text-green-800">
                            Bookmaker signup deals are coming soon!
                          </h3>
                        </Alert>
                      )}
                    </li>
                  </ul>
                </div>
              </Card>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
