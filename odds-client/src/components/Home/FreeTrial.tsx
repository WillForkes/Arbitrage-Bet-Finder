import { startFreeTrial } from "@/api";
import { Plan } from "@/types";
import { useRouter } from "next/router";
import Image from "next/image";
import React, { useContext } from "react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";
import Link from "next/link";
import { AlertContext } from "@/pages/_app";
import { Toast } from "flowbite-react";


export default function FreeTrial() {
    const user: User | null = useContext(UserContext).user;
    const alertContext = useContext(AlertContext);
    const [showToastMsg, setShowToastMsg] = React.useState(false);
    const [toastMsg, setToastMsg] = React.useState("");
    const [toastError, setToastError] = React.useState(false);

    async function sft() {
        try{
            const response = await startFreeTrial();
            alertContext?.setAlert({ msg: "Successfully started free trial!", error: false });
            setShowToastMsg(true);
            setToastMsg("Successfully started free trial!");
        } catch (err) {
            alertContext?.setAlert({ msg: "Failed to start free trial!", error: true });
            setShowToastMsg(true);
            setToastMsg("Failed to start free trial");
            setToastError(true);
        }
    }

    return (
        <>
            <section className="bg-white dark:bg-gray-900">
                <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                    <Image width={600} height={300} className="w-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg" alt="dashboard image" />
                    <Image width={600} height={300} className="w-full hidden dark:block" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg" alt="dashboard image" />
                    <div className="mt-4 md:mt-0">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Try for free today.</h2>
                        <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                            Get ready to transform your sports betting game with Arbster - and the best part? You can try it out for FREE for your first 5 days!  With full access to our powerful service, you'll see firsthand how our arbitrage betting dashboard and positive EV tool can help you make smarter bets and win big. Don't wait - start your winning streak today with Arbster.
                        </p>

                        {user ? (
                            <button onClick={() => {sft()}} className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900">
                                Start Free Trial
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" ></path></svg>
                            </button>
                        ) : (
                            <Link href="/auth/login" className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900">
                                Login to Start Free Trial
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" ></path></svg>
                            </Link>
                        )}

                        <div className="py-2"></div>
                        {showToastMsg && toastError ? (
                            <Toast>
                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-green-500 dark:bg-red-800 dark:text-green-200">
                                    <svg fill="#fa2a2a" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"/></svg>
                                </div>
                                <div className="ml-3 text-sm font-normal">
                                    {toastMsg}
                                </div>
                                <Toast.Toggle />
                            </Toast>
                        ) : (showToastMsg && !toastError) ? (
                            <Toast>
                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                    <svg fill="#32a852" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z"/></svg>
                                </div>
                                <div className="ml-3 text-sm font-normal">
                                    {toastMsg}
                                </div>
                                <Toast.Toggle />
                            </Toast>
                        ) : (
                            <></>
                        )}
                        
                    </div>
                </div>
            </section>
        </>
    );
}
