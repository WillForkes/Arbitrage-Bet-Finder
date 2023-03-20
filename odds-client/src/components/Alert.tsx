import { AlertContext } from "@/pages/_app";
import { Toast, Alert } from "flowbite-react";
import React, { useContext } from "react";

export default function AlertCom() {
  const error = useContext(AlertContext);
  if (error?.msg == "") return null;
  return (
    <div className="px-10 dark:bg-gray-900">
      <Alert
        color="failure"
        onDismiss={function onDismiss() {
          error?.setAlert({ msg: "", error: null });
        }}
      >
        <span>
          <span className="font-medium">Error!</span>
          {" " + error?.msg}
        </span>
      </Alert>
    </div>
  );
}