import { Dropdown } from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";

import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import Logo from "../../../public/arbster.png";
import Logo2 from "../../../public/arbster_logo.png";

import { useRouter } from "next/router";

export default function ProfileDropdown() {
  const user = useContext(UserContext);
  const router = useRouter();
  return (
    <>
      <Dropdown label="Account">
        <Dropdown.Header>
          <Image
            src={Logo}
            height={60}
            className="w-8 h-8 rounded-full"
            alt="user photo"
          />
          <span className="block text-sm">{user?.user?.auth0.nickname}</span>
          <span className="block truncate text-sm font-medium">
            {user?.user?.auth0.name}
          </span>
        </Dropdown.Header>
        <Dropdown.Item onClick={() => router.push("/profile")}>
          Settings
        </Dropdown.Item>
        <Dropdown.Item onClick={() => router.push("/tracker")}>
          Bet Tracker
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={() =>
            window.location.assign(process.env.NEXT_PUBLIC_URI + "/logout")
          }
        >
          Sign out
        </Dropdown.Item>
      </Dropdown>
    </>
  );
}
