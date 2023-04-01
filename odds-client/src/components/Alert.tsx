import { AlertContext } from "@/pages/_app";
import { Alert } from "flowbite-react";
import React, { useContext, useEffect } from "react";

export default function AlertCom() {
  const error = useContext(AlertContext);
  useEffect(() => {
    setTimeout(() => {
      error?.setAlert({ msg: "", error: null });
    }, 3000);
  }, []);
  if (error?.msg == "") return null;

  return (
    <div className="dark:bg-gray-900 flex items-center justify-center ">
      <Alert
        color={error?.error ? "failure" : "success"}
        onDismiss={function onDismiss() {
          error?.setAlert({ msg: "", error: null });
        }}
        className="fixed top-5px w-1/2 z-50"
      >
        <span className="px-2">
          <span className="font-medium">
            {error?.error ? "Error!" : "Success!"}
          </span>
          {" " + error?.msg}
        </span>
      </Alert>
    </div>
  );
}
