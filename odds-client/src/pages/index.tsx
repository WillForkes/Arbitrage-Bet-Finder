import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Pricing from "@/components/Home/Pricing";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import Testimonials from "@/components/Home/Testimonials";
import Tline from "@/components/Home/Timeline";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
        <Hero />
        <Pricing />
        <Features />
        <Tline />
        <Testimonials />

    </>
  );
}
