import { getter } from "@/api";
import Nav from "@/components/constant/Nav";
import Footer from "@/components/constant/Footer";
import "@/styles/globals.css";
import { User } from "@/types";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import useSWR from "swr";

export const UserContext = createContext<{
  user: User | null;
  auth: boolean | null;
}>({ user: null, auth: false });
export const AlertContext = createContext<{
  msg: string | null;
  error: boolean | null;
  setAlert: () => void;
} | null>({ msg: "", error: null, setAlert: () => {} });

export default function App({ Component, pageProps }: AppProps) {
  function setAlert() {}
  const { data, error, isLoading } = useSWR("/profile", getter);
  var user,
    isAuth: boolean | null = null;

  if (data && !isLoading) {
    user = data;
    isAuth = true;
  } else if (!isLoading) {
    isAuth = false;
    console.log("not logged in");
  }

  return (
    <div className="c">
      <UserContext.Provider value={{ user: user, auth: isAuth }}>
        <AlertContext.Provider
          value={{ msg: null, error: null, setAlert: setAlert }}
        >
          <Nav />
          <Component {...pageProps} />
        </AlertContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
