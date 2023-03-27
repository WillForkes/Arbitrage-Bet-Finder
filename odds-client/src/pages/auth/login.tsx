import React, { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    window.location.assign("http://localhost:3000/login");
  });
  return <div>Loading...</div>;
}
