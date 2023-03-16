import { User } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import Modal from "./Modal";
import { Tabs, HiClipboardList, HiUserCircle } from "flowbite-react"

interface props {
  user: User;
}

export default function BetLoader({ user }: props) {

  return (
    <>
    <Tabs.Group
        aria-label="Tabs with icons"
        style="underline"
        >
        <Tabs.Item
            title="Profile"
            icon={HiUserCircle}
        >
            Profile content
        </Tabs.Item>
        <Tabs.Item
            active={true}
            title="Dashboard"
            icon={MdDashboard}
        >
            Dashboard content
        </Tabs.Item>
        <Tabs.Item
            title="Settings"
            icon={HiAdjustments}
        >
            Settings content
        </Tabs.Item>
        <Tabs.Item
            title="Contacts"
            icon={HiClipboardList}
        >
            Contacts content
        </Tabs.Item>
        <Tabs.Item
            disabled={true}
            title="Disabled"
        >
            Disabled content
        </Tabs.Item>
    </Tabs.Group>
      <div className="match">
        <h3>Welcome, {user.auth0.nickname}</h3>
        <p>Email: {user.auth0.email}</p>
        <p>Account Created: {user.dbuser.createdAt}</p>
        <p>Your Plan: {user.dbuser.subscription.plan}</p>
        <p>Your Plan Expires: {user.dbuser.subscription.planExpiresAt}</p>
        <hr></hr>
        <h3>Identifiers</h3>
        <p>SID: {user.auth0.sid}</p>
        <p>Auth0 ID: {user.auth0.sub}</p>
      </div>
    </>
  );
}
