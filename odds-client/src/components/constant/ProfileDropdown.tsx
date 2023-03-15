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
  return (
    <div className="flex items-center md:order-2">
      <Dropdown label="Account">
        <Dropdown.Header>
          <Image
            src={Logo}
            height={60}
            className="w-8 h-8 rounded-full"
            alt="user photo"
          />
          <span className="block text-sm">Bonnie Green</span>
          <span className="block truncate text-sm font-medium">
            bonnie@flowbite.com
          </span>
        </Dropdown.Header>
        <Dropdown.Item icon={HiViewGrid}>Dashboard</Dropdown.Item>
        <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
        <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item icon={HiLogout}>Sign out</Dropdown.Item>
      </Dropdown>
    </div>
  );
}
