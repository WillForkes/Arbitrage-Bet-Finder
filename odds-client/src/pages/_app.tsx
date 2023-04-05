import { getter } from "@/api";
import Nav from "@/components/constant/Nav";
import Footer from "@/components/constant/Footer";
import "@/styles/globals.css";
import { User } from "@/types";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import useSWR from "swr";
import Alert from "@/components/Alert";
import Script from "next/script";

export const UserContext = createContext<{
  user: User | null;
  auth: boolean | null;
}>({ user: null, auth: false });

export const AlertContext = createContext<{
  msg: string | null;
  error: boolean | null;
  setAlert: (data: { msg: string; error: boolean | null }) => void;
} | null>({ msg: "", error: null, setAlert: () => {} });

export default function App({ Component, pageProps }: AppProps) {
  const { data, error, isLoading } = useSWR("/profile", getter);
  const [errorState, setErrorState] = useState<{
    msg: string;
    error: boolean | null;
  }>({ msg: "", error: null });

  function setAlert(data: { msg: string; error: boolean | null }) {
    setErrorState({ msg: data.msg, error: data.error });
  }
  var user,
    isAuth: boolean | null = null;

  if (data && !isLoading) {
    user = data;
    isAuth = true;
  } else if (!isLoading) {
    isAuth = false;
  }

  return (
    <div className="bg-gray-700">
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-7H7GEWNWCK"
      />
          
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7H7GEWNWCK', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
      <title>Arbster - #1 Betting Tools</title>
      <UserContext.Provider value={{ user: user, auth: isAuth }}>
        <AlertContext.Provider
          value={{
            msg: errorState.msg,
            error: errorState.error,
            setAlert: setAlert,
          }}
        >
          <Nav />
          <Alert />
          <Component {...pageProps} />
          <Footer />
        </AlertContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
