import { User, Invoice } from "@/types";
import Link from "next/link";
import React, { useContext, useState } from "react";
import Modal from "./Modal";
import {
  Badge,
  Button,
  TextInput,
  Checkbox,
  Label,
  Tabs,
  Card,
  Toast
} from "flowbite-react";
import Image from "next/image";
import Logo from "../../public/arbster.png";
import {
  createPortal,
  getter,
  updateNotificationsA,
  updateProfileA,
  updateWhitelist,
} from "@/api";
import ProfileEdit from "./ProfileEdit";
import { AlertContext } from "@/pages/_app";
import Select from "react-tailwindcss-select";

interface props {
  user: User;
  invoices: Invoice[];
  bookMakers: { id: number; bookName: string }[];
}

export default function ProfileLoader({ user, invoices, bookMakers }: props) {
  const [editProfile, setEditProfile] = useState(false);
  const [region, setRegion] = useState(user.dbuser.region);
  const [notifications, setNotifications] = useState({
    email: user.dbuser.emailNotifications,
    emaila: user.auth0.email,
    sms: user.dbuser.smsNotifications,
    phone: user.dbuser.phone,
  });
  const [whiteList, setWhitelist] = useState(
    JSON.parse(user.dbuser.whitelist).map((x: string) => ({
      label: x,
      value: x,
    }))
  );

  const alertContext = useContext(AlertContext);
  async function gotoBillingPortal() {
    try {
      var response = await createPortal();
      window.location.assign(response.url);
    } catch (e) {
      console.error(e);
    }
  }

  async function updateProfile(user: User) {
    try {
      await updateProfileA(region);
      setEditProfile(false);
    } catch (e: any) {
      alertContext?.setAlert({ msg: e.toString(), error: true });
    }
  }

  async function updateNotifications() {
    try {
      await updateNotificationsA(notifications);
      await updateWhitelist(whiteList);
    } catch (e) {
      alertContext?.setAlert({ msg: "Error updating user", error: true });
    }
  }

  async function gotoPDF(invoice: Invoice) {
    try {
      window.location.assign(invoice.stripeInvoicePdfUrl);
    } catch (e: unknown) {
      alertContext?.setAlert({ msg: "Error getting pdf", error: true });
    }
  }

  return (
    <>
      <Tabs.Group
        className="dark:bg-gray-900 dark:text-white py-4 p-10"
        aria-label="Tabs with icons"
        style="underline"
      >
        <Tabs.Item active={true} title="Profile">
          <div className="mx-auto max-w-screen-xl">
            <Card>
              <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5`">
                <dl>
                  <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                    Email
                  </dt>
                  <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                    {user.auth0.email}
                  </dd>
                  <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                    Nickname
                  </dt>
                  <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                    {user.auth0.nickname}
                  </dd>
                  <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                    Plan
                  </dt>

                  {/* Small text div that takes up only 100 pixels */}
                  <div className="w-20 h-10">
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      {user.dbuser.plan.toUpperCase()}
                    </span>
                  </div>
                  <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                    Region
                  </dt>
                  {editProfile ? (
                    <div className="">
                      <TextInput
                        onChange={(e) => setRegion(e.target.value)}
                        type="text"
                        value={region}
                      />
                      <button
                        type="button"
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        onClick={() => updateProfile(user)}
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                      {region}
                    </dd>
                  )}
                </dl>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {!editProfile ? (
                      <button
                        type="button"
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        onClick={() => setEditProfile(!editProfile)}
                      >
                        <svg
                          aria-hidden="true"
                          className="mr-1 -ml-1 w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                          <path d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                        </svg>
                        Edit
                      </button>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 mr-1.5 -ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Invoices">
          <div className="mx-auto max-w-screen-xl">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  Latest invoices
                </h5>
                <button
                  onClick={() => {
                    gotoBillingPortal();
                  }}
                  className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                >
                  Goto Billing Portal
                </button>
              </div>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* foreach invoice */}
                  {invoices.map((invoice: Invoice) => (
                    <li key={invoice.id} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="shrink-0">
                          <Image
                            src={Logo}
                            className="h-8 w-8 rounded-full"
                            alt="Neil image"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.billing_reason}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            ID: {invoice.stripeInvoiceId}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {new Date(invoice.createdAt).toDateString()}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {/* If starter - 29.99, if pro, 49.99, if plus 99.99 */}

                              ${invoice.amount_paid / 100}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          <button
                            onClick={() => {
                              gotoPDF(invoice);
                            }}
                            className="text-white bg-gray-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                          >
                            Download Invoice PDF
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Settings">
          <div className="mx-auto max-w-screen-xl">
            <Card>
              <div className="flex flex-col gap-4" id="checkbox">
                <div className="flex items-center gap-2 p-2">
                  <Checkbox id="promotion" />
                  <Label htmlFor="promotion">
                    I want to get promotional offers
                  </Label>
                </div>
                <div className="flex items-center gap-2 p-2">
                  <Checkbox
                    id="email"
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        email: !notifications.email,
                      })
                    }
                    checked={notifications.email}
                    disabled={user.dbuser.plan == "pro" || user.dbuser.plan == "plus" || user.dbuser.plan == "starter" ? false : true}

                  />
                  <Label htmlFor="email">Email notifications</Label>
                </div>
                <div>
                  <TextInput
                    id="email4"
                    type="email"
                    placeholder="name@arbster.com"
                    required={true}
                    value={notifications.emaila}
                    disabled={user.dbuser.plan == "pro" || user.dbuser.plan == "plus" || user.dbuser.plan == "starter" ? false : true}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emaila: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                    <div className="flex items-center gap-2 p-2">
                        <Checkbox
                        id="email"
                        onClick={() =>
                            setNotifications({
                            ...notifications,
                            sms: !notifications.sms,
                            })
                        }
                        checked={notifications.sms}
                        disabled={user.dbuser.plan == "pro" || user.dbuser.plan == "plus" ? false : true}
                        />
                        <Label htmlFor="email">Phone notifications</Label>
                    </div>
                    <div>
                        <TextInput
                        id="email4"
                        type="text"
                        placeholder="+11234567890"
                        required={true}
                        value={notifications.phone}
                        disabled={user.dbuser.plan == "pro" || user.dbuser.plan == "plus" ? false : true}
                        onChange={(e) =>
                            setNotifications({
                            ...notifications,
                            phone: e.target.value,
                            })
                        }
                        />
                    </div>
                </div>


                <div>
                  <Label htmlFor="email">Whitelisted bookmakers</Label>
                  <Select
                    options={
                      bookMakers
                        ? bookMakers.map((obj) => ({
                            value: obj.bookName,
                            label: obj.bookName,
                          }))
                        : []
                    }
                    onChange={(e) => setWhitelist(e)}
                    primaryColor="gray"
                    value={whiteList}
                    isMultiple={true}
                  />
                </div>
                <Button onClick={() => updateNotifications()} type="submit">
                  Save account settings
                </Button>
              </div>
            </Card>
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
}
