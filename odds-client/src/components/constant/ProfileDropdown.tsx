import {
  Dropdown,
  HiViewGrid,
  HiCog,
  HiCurrencyDollar,
  HiLogout,
} from "flowbite-react";
import { UserContext } from "@/pages/_app";
import { User } from "@/types";

import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import Logo from "../../../public/arbster.png";

export default function ProfileDropdown() {
  const user = useContext(UserContext);
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
        <Dropdown.Item icon={HiViewGrid}>Dashboard</Dropdown.Item>
        <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
        <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={() => window.location.assign("http://localhost:3000/logout")}
          icon={HiLogout}
        >
          Sign out
        </Dropdown.Item>
      </Dropdown>
    </>
  );
}
