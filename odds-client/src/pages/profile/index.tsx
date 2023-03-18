import ProfileLoader from "@/components/ProfileLoader";
import { User, Invoice } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Spinner } from "flowbite-react";

export default function profile() {
    let { data, error } = useSWR("/profile", getter);
    const user: User = data;

    const { data: invoicesData, error: invoiceError } = useSWR("/profile/invoices", getter);
    const invoices: Invoice[] = invoicesData?.invoices;

    return (
    <div>
        {(data && invoices) ? (
            <ProfileLoader user={user} invoices={invoices} key={user.auth0.sid} />
        ) : (
            <div className="mx-auto max-w-screen-md p-64 text-center mb-8 lg:mb-12">
                <Spinner aria-label="Default status example" />
            </div>
        )}
    </div>
    );
}
