import React, { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    window.location.assign(process.env.NEXT_PUBLIC_URI + "/login");
  });
  return <div>Loading...</div>;
}
