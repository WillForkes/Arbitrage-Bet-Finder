import React, { useState, useContext } from "react";
import { createBet, createSignupDeal } from "@/api";
import { AlertContext, UserContext } from "@/pages/_app";
import { currencyCode } from "@/utils";

export default function SignupDealModal({
  isVisible,
  closeModal,
}: {
  isVisible: boolean;
  closeModal: () => void;
}) {
  const alertContext = useContext(AlertContext);
  const [name, setName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [deal, setDeal] = useState<string>("");
  const [date, setDate] = useState<string>("");
  async function newBet(e: any) {
    e.preventDefault();
    try {
      if (name != "" && link != "" && date != "") {
        await createSignupDeal(name, deal, link, new Date(date));
      }

      alertContext?.setAlert({ msg: "Deal created!", error: false });
    } catch (e) {
      console.error(e);
      alertContext?.setAlert({ msg: "Error creating deal!", error: true });
    }

    closeModal();
  }

  if (isVisible == false) return null;

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative w-full h-full max-w-2xl md:h-auto text-center">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add to signup deals
            </h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form action="" className="max-w-sm mx-auto p-4">
            <input
              type="text"
              value={name}
              placeholder={"Name"}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              value={link}
              placeholder={"Link"}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setLink(e.target.value)}
            />
            <input
              type="text"
              value={deal}
              placeholder={"Deal: make professional this is what users see"}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setDeal(e.target.value)}
            />
            <input
              type="date"
              value={date}
              placeholder={"Date"}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              onClick={(e) => newBet(e)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Deal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
