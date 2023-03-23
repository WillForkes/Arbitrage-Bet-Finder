import { AlertContext } from "@/pages/_app";
import { Alert } from "flowbite-react";
import React, { useContext } from "react";

export default function AlertCom() {
  const error = useContext(AlertContext);
  if (error?.msg == "") return null;
  return (
    <div className="px-64 py-4 dark:bg-gray-900 sticky">
      <Alert
        color={error?.error ? "failure" : "success"}
        onDismiss={function onDismiss() {
          error?.setAlert({ msg: "", error: null });
        }}
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
