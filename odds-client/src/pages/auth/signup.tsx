import React, { useEffect } from "react";

export default function Signup() {
  useEffect(() => {
    window.location.assign(process.env.NEXT_PUBLIC_URI + "/sign-up");
  });
  return <div>Loading...</div>;
}
