import React from "react";
import Pricing from "./Home/Pricing";

export default function FreeModal() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-0 z-50">
      <div className="relative w-full h-full max-w-2xl md:h-auto text-center">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Subscribe
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
