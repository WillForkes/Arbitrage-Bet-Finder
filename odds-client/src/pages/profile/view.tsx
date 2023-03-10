import ProfileLoader from "@/components/ProfileLoader";
import { User } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";

export default function profile() {
  const { data, error } = useSWR("/profile", getter);

  // parse the data into a User object
  const user: User = data;

  return (
    <div>
      {data ? (
        <ProfileLoader user={user} key={user.auth0.sid} />
        ) : (
        <p>loading</p>
      )}
    </div>
  );
}
