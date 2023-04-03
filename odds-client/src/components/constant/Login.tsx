import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <>
      <Link
        href="/auth/login"
        className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
      >
        Log in
      </Link>
      <Link
        href="/auth/signup"
        className="text-white bg-gray-400 hover:bg-primary-900 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-gray-700 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
      >
        Sign Up
      </Link>
    </>
  );
}
