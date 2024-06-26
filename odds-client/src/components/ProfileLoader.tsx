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
  Toast,
  Dropdown,
} from "flowbite-react";
import Image from "next/image";
import CancelModal from "./CancelModal";
import Logo from "../../public/arbster.png";
import {
  cancelPayment,
  createPortal,
  getter,
  updateNotificationsA,
  updateProfileA,
  updateWhitelist,
  activateCancelDeal
} from "@/api";
import ProfileEdit from "./ProfileEdit";
import { AlertContext } from "@/pages/_app";
import Select from "react-tailwindcss-select";
import { HiArrowNarrowRight, HiCalendar, HiCheck, HiInformationCircle, HiEye } from "react-icons/hi";

interface props {
  user: User;
  invoices: Invoice[];
  bookMakers: { id: number; bookName: string }[];
  subscriptionStatus: { id: string; expireDate: string; status: string };
}

export default function ProfileLoader({
  user,
  invoices,
  bookMakers,
  subscriptionStatus,
}: props) {
  const [editProfile, setEditProfile] = useState(false);
  const [region, setRegion] = useState<string>(user.dbuser.region);
  const [notifications, setNotifications] = useState({
    email: user.dbuser.emailNotifications,
    emaila: user.auth0.email,
    sms: user.dbuser.smsNotifications,
    phone: user.dbuser.phone,
  });
  const [whiteList, setWhitelist] = useState(
    user.dbuser.whitelist != null
      ? JSON.parse(user.dbuser.whitelist).map((x: string) => ({
          label: x,
          value: x,
        }))
      : []
  );
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const alertContext = useContext(AlertContext);

  async function cancelSub() {
    try {
      await cancelPayment();
      alertContext?.setAlert({
        msg: "Canceled Subscriptioin",
        error: false,
      });
    } catch (e: any) {
      alertContext?.setAlert({ msg: e.toString(), error: true });
    }
  }

  async function updateProfile(user: User) {
    try {
      await updateProfileA(region);
      setEditProfile(false);
      alertContext?.setAlert({
        msg: "Profile edited successfully",
        error: false,
      });
    } catch (e: any) {
      alertContext?.setAlert({ msg: e.toString(), error: true });
    }
  }

  async function updateNotifications() {
    try {
      await updateNotificationsA(notifications);
      await updateWhitelist(whiteList);
      alertContext?.setAlert({ msg: "Whitelist updated", error: false });
    } catch (e) {
      alertContext?.setAlert({ msg: "Error updating user", error: true });
    }
  }

  async function gotoPDF(invoice: Invoice) {
    try {
      window.location.assign("");
    } catch (e: unknown) {
      alertContext?.setAlert({ msg: "Error getting pdf", error: true });
    }
  }

  async function activateDeal() {
    try{
        await activateCancelDeal(user.dbuser.subscription[0].paypalSubscriptionId)
        alertContext?.setAlert({ msg: "50% Off deal applied!", error: false });
    }catch(e){
        alertContext?.setAlert({ msg: "Error activating deal. Please contact support", error: true });
    }
  }

  return (
    <>
      <CancelModal isVisible={cancelModalVisible} closeModal={() => {setCancelModalVisible(false)}} cancelSub={cancelSub} cancelDealActivated={user.dbuser.cancelDealActivated} activateDeal={activateDeal}/>
      
      <Tabs.Group
        className="dark:bg-gray-900 dark:text-white py-4 p-10"
        aria-label="Tabs with icons"
        style="underline"
      >
        <Tabs.Item active={true} title="Profile">
          <div className="mx-auto max-w-screen-xl">
            <Card className=" max-w-md mx-auto">
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
                  {user.dbuser.plan != "free" ? (
                    <div>
                      <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                        Plan Renews/Expires At
                      </dt>
                      <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                        {new Date(user.dbuser.planExpiresAt).toDateString()}
                      </dd>
                    </div>
                  ) : null}

                  <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                    Plan
                  </dt>

                  {/* Small text div that takes up only 100 pixels */}
                  <div className="w-20 h-10">
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      {user.dbuser.staff
                        ? "STAFF"
                        : user.dbuser.plan.toUpperCase()}
                    </span>
                  </div>
                  <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                    Region
                  </dt>

                  {editProfile ? (
                    <div className="">
                      <select
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => setRegion(e.target.value)}
                      >
                        <option selected>Choose a country</option>
                        <option value="US">US</option>
                        <option value="UK">UK</option>
                        <option value="EU">EU</option>
                        <option value="AU">AU</option>
                      </select>
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
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-900"
                  >
                    Onboarding progress
                    <HiArrowNarrowRight className="ml-2" />

                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Billing">
          <div className="mx-auto max-w-screen-xl">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  Billing History
                </h5>
                {subscriptionStatus?.status == "ACTIVE" ? (
                  <button
                    onClick={() => {
                    setCancelModalVisible(true);
                    }}
                    className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    Cancel Subscription
                  </button>
                ) : (
                  // Text saying their sub will expire on x date
                  <div className="flex">
                    <h3 className="mr-2">Your subscription will expire on</h3>
                    <h3 className="font-bold">
                      {new Date(user.dbuser.planExpiresAt).toDateString()}
                    </h3>
                  </div>
                )}
              </div>
              
              <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* foreach invoice */}
                  {invoices != null
                    ? invoices.map((invoice: Invoice) => (
                        <li key={invoice?.id} className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4">
                            <div className="shrink-0">
                              <Image
                                src={Logo}
                                className="h-8 w-8 rounded-full"
                                alt="Arbster logo"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {invoice?.status} - {invoice?.payer_email}
                              </p>
                              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                ID: {invoice?.id}
                              </p>
                              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {new Date(invoice?.time).toDateString()}
                              </p>
                              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {/* If starter - 29.99, if pro, 49.99, if plus 99.99 */}
                                $
                                {
                                  invoice?.amount_with_breakdown.gross_amount
                                    ?.value
                                }
                              </p>
                            </div>
                            {/* <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <button
                                onClick={() => {
                                  gotoPDF(invoice);
                                }}
                                className="text-white bg-gray-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                              >
                                Download Invoice PDF
                              </button>
                            </div> */}
                          </div>
                        </li>
                      ))
                    : null}
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
                    I want to get promotional offers on free signup deals and
                    new products
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
                    disabled={
                      user.dbuser.plan == "pro" ||
                      user.dbuser.plan == "plus" ||
                      user.dbuser.plan == "starter" ||
                      user.dbuser.staff
                        ? false
                        : true
                    }
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
                      disabled={
                        user.dbuser.plan == "pro" ||
                        user.dbuser.plan == "plus" ||
                        user.dbuser.staff
                          ? false
                          : true
                      }
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
                      disabled={
                        user.dbuser.plan == "pro" ||
                        user.dbuser.plan == "plus" ||
                        user.dbuser.staff
                          ? false
                          : true
                      }
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
