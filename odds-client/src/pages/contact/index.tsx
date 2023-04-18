import ProfileLoader from "@/components/ProfileLoader";
import { User, Invoice } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Card, TextInput, Label, Checkbox, Button, Textarea} from "flowbite-react";
import Head from "next/head";

export default function support() {

    return (
    <>
        <Head>
            <title>Arbster | Contact Us</title>
            <meta name="description" content="This page helps users to get in contact with our support team" />
        </Head>
        <section className="dark:bg-gray-900 py-4">
            <div className="mx-auto max-w-screen-md text-center">
                <span className="font-bold tracking-wider uppercase dark:text-primary-700">
                Support
                </span>
                <h2 className="text-4xl font-bold lg:text-5xl">
                Join our discord for support
                </h2>
            </div>
            <div className="page-offset-x py-8 bg-gray-900">
                <iframe className="mx-auto" src="https://discord.com/widget?id=1083067040673300480&theme=dark" width="600" height="500" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
                    
                </iframe>
            </div>
        </section>
    </>
    );
}
