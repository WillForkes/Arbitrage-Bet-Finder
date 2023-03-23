import React, { useState, useContext } from "react";
import { createBet, spreadStake, hedgeStake } from "@/api";
import { SpreadStake } from "@/types";
import { AlertContext } from "@/pages/_app";

export default function Pagination({
    currentPage,
    itemsPerPage,
    maxItems,
    updateItems
}: {
    currentPage: number;
    itemsPerPage: number;
    maxItems: number;
    updateItems: (page: number) => void;
}) {
    const [page, setPage] = useState(currentPage);
    const [maxPage, setMaxPage] = useState(Math.round(maxItems / itemsPerPage));
    const [pageNumbers, setPageNumbers] = useState(getPageNumbers());

    function handlePageChange(p: number) {
        if(p < 1 || p > maxPage) return;
        setPage(p);
        setPageNumbers(getPageNumbers());
        updateItems(p);
    }

    function getPageNumbers() : string[] {
        // format numbers so:
        // [page-2, page-1, page, page+1, page+2]
        let numbers = [];
        for(let i = page - 2; i <= page + 2; i++) {
            if(i < 1 || i > maxPage) continue;
            numbers.push(i.toString());
        }
        console.log(numbers)

        return numbers;
    }

  return (
    <>
        <nav className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing page
                <span className="font-semibold text-gray-900 dark:text-white"> {page} </span>
                 of 
                <span className="font-semibold text-gray-900 dark:text-white"> {maxPage}</span>
            </span>
            <ul className="inline-flex items-stretch -space-x-px">
                <li>
                    <button onClick={() => {
                        handlePageChange(1)
                    }} className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Previous</span>
                        <svg className="w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"  />
                        </svg>
                        <svg className="w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"  />
                        </svg>
                    </button>
                </li>
                <li>
                    <button onClick={() => {
                        handlePageChange(page - 1)
                    }} className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Previous</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"  />
                        </svg>
                    </button>
                </li>
                {/* aria-current="page" */}
                
                
                {/* for each item in getPageNumbers */}
                {pageNumbers.map((num) => (
                    <li key={num}>
                        <button onClick={() => {
                        handlePageChange(parseInt(num))
                    }}
                        className={`${(page == parseInt(num)) ? "dark:bg-gray-700" : "dark:bg-gray-800"} flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                            {num}
                        </button>
                    </li>
                ))}

                {(maxPage > 5) ? (
                    <>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                ...
                            </a>
                        </li>

                        <li>
                        <button onClick={() => {
                            handlePageChange(maxPage)
                        }}
                        className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                {maxPage}
                            </button>
                        </li>
                    </>
                ) : (null)}


                <li>
                    <button onClick={() => {
                        handlePageChange(page + 1)
                    }} className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Next</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"  />
                        </svg>
                    </button>
                </li>

            </ul>
        </nav>
    </>
  );
}
