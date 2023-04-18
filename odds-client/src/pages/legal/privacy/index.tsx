import React, { useState } from "react";
import Image from "next/image";
import { Accordion } from "flowbite-react";
import Link from "next/link";
import Head from "next/head";

export default function privacy() {
  return (
    <>
        <Head>
            <title>Arbster | Privacy policy</title>
            <meta name="description" content="Arbster privacy policy agreement" />
        </Head>
        <section className="bg-white dark:bg-gray-900">
            
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
                    <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white"><span className="font-extrabold">Privacy Policy</span></h2>
                    <p className="mb-4 font-bold">
                        Information Collected
                    </p>
                    <p className="mb-4 font-light">
                        Information Collected: We collect personal information such as your name, email address, and payment information when you sign up for our service. We may also collect information about your betting activity to improve our service.
                    </p>
                    <p className="mb-4 font-bold">
                        Use of Information
                    </p>
                    <p className="mb-4 font-light">
                        Use of Information: We use your personal information to provide you with our service and to improve our service. We may also use your information to send you promotional materials or to contact you about our service.
                    </p>
                    <p className="mb-4 font-bold">
                        Disclosure of Information
                    </p>
                    <p className="mb-4 font-light">
                        Disclosure of Information: We do not disclose your personal information to third parties except as necessary to provide our service, to comply with applicable laws, or to protect our rights and property.
                    </p>
                    <p className="mb-4 font-bold">
                        Security
                    </p>
                    <p className="mb-4 font-light">
                        Security: We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.
                    </p>
                    <p className="mb-4 font-bold">
                        Data Retention
                    </p>
                    <p className="mb-4 font-light">
                        Data Retention: We retain your personal information for as long as necessary to provide you with our service and to comply with applicable laws.
                    </p>                    
                    <Link href="/legal/tos" className="inline-flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">
                        Terms of service
                        <svg className="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path></svg>
                    </Link>
                </div>
            </div>
        </section>
    </>
  );
}
