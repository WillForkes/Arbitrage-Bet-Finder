import React from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Card, Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import { User } from "@/types";

export default function UserPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR("/admin/user/" + id, getter, {
    refreshInterval: 10000,
  });

  // parse bet data
  let user: User["dbuser"] = data?.user;
  if (error || !user) {
    return (
      <section className="bg-white dark:bg-gray-900 page-offset-x py-8 bg-gray-900">
        <div className="mx-auto max-w-screen-full p-32 text-center mb-8 lg:mb-12">
          <h2 className="text-md font-bold dark:text-white mb-2">
            This user doesn't exist
          </h2>
          <Spinner aria-label="Default status example" />
        </div>
      </section>
    );
  }

  return (
    <>
      <Card className="bg-white dark:bg-gray-900 page-offset-x py-8 bg-gray-900">
        <div className="max-w-screen-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">User Details</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">
                Auth ID:
              </label>
              <p className="text-gray-900 dark:text-white">{user.authid}</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">
                Subscription:
              </label>
              {user.subscription.map((sub) => (
                <div key={sub.id} className="flex flex-col gap-2">
                  <p className="text-gray-900 dark:text-white">
                    {sub.paypalSubscriptionId}
                  </p>

                  <p className="text-gray-900 dark:text-white">{sub.plan}</p>
                  <p className="text-gray-900 dark:text-white">
                    Created At: {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    Expires At:{" "}
                    {new Date(sub.planExpiresAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">Email:</label>
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">
                Phone Number:
              </label>
              <p className="text-gray-900 dark:text-white">
                {user.phone == null ? "NONE" : user.phone}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">
                Region:
              </label>
              <p className="text-gray-900 dark:text-white">{user.region}</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">
                Banned:
              </label>
              <p className="text-gray-900 dark:text-white">
                {user.banned ? "BANNED" : "ACTIVE"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">
                Created At:
              </label>
              <p className="text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">
                SMS Notifications:
              </label>
              <p className="text-gray-900 dark:text-white">
                {user.smsNotifications ? "ON" : "OFF"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-600 font-bold md:w-1/3">
                Email Notifications:
              </label>
              <p className="text-gray-900 dark:text-white">
                {user.emailNotifications ? "ON" : "OFF"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
