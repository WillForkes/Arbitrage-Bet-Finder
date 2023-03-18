import { AlertContext } from "@/pages/_app";
import { Toast, HiCheck, Alert } from "flowbite-react";
import React, { useContext } from "react";

export default function AlertCom() {
  const error = useContext(AlertContext);
  if (error?.msg == "") return null;
  return (
    <div>
      <Alert
        color="failure"
        onDismiss={function onDismiss() {
          error?.setAlert({ msg: "", error: null });
        }}
      >
        <span>
          <span className="font-medium">Info alert!</span> Change a few things
          up and try submitting again.
        </span>
      </Alert>
    </div>
  );
}
