import { getter } from "@/api";
import Nav from "@/components/constant/Nav";
import Footer from "@/components/constant/Footer";
import "@/styles/globals.css";
import { User } from "@/types";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import useSWR from "swr";
import Alert from "@/components/Alert";

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
    console.log("not logged in");
  }

  return (
    <div className="bg-gray-700">
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
        </AlertContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
