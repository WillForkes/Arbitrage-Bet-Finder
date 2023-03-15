import { getter } from "@/api";
import Nav from "@/components/constant/Nav";
import "@/styles/globals.css";
import { User } from "@/types";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import useSWR from "swr";

export const UserContext = createContext<User | null>(null);

export default function App({ Component, pageProps }: AppProps) {
  const { data, error } = useSWR("/profile", getter);
  var user;
  if (data) {
    user = data;
  }

  return (
    <div className="c">
      <UserContext.Provider value={user}>
        <Nav />
        <Component {...pageProps} />
      </UserContext.Provider>
    </div>
  );
}
