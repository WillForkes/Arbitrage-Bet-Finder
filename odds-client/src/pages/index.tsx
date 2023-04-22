import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Pricing from "@/components/Home/Pricing";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import Testimonials from "@/components/Home/Testimonials";
import Tline from "@/components/Home/Timeline";
import FreeTrial from "@/components/Home/FreeTrial";
import Stats from "@/components/Home/Stats";
import WhatIs from "@/components/Home/WhatIs";
import Blog from "@/components/Home/Blog";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
        <Head>
            <title>Arbster - Sports Betting Tools</title>
            <meta name="description" content="Discover advanced online sports betting tools at Arbster, including a powerful arbitrage finder and more for maximizing your betting profits." />
        </Head>

        <Hero />
        <Stats/>
        <WhatIs />
        <Features />

        <Blog />
        <Pricing />
        <Tline />
        <Testimonials />
        <FreeTrial />
    </>
  );
}
