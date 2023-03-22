import { AlertContext } from "@/pages/_app";
import { Toast, HiCheck, Alert } from "flowbite-react";
import React, { useContext } from "react";

export default function AlertCom() {
  const error = useContext(AlertContext);
  if (error?.msg == "") return null;
  return (
    <div>
      <Alert
        color={error?.error ? "failure" : "success"}
        onDismiss={function onDismiss() {
          error?.setAlert({ msg: "", error: null });
        }}
      >
        <span>
          <span className="font-medium">
            {error?.error ? "Error!" : "Success!"}
          </span>
          {" " + error?.msg}
        </span>
      </Alert>
    </div>
  );
}
