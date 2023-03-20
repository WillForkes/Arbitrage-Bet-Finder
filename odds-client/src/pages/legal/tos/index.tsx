import React, { useState } from "react";
import Image from "next/image";
import { Accordion } from "flowbite-react";
import Link from "next/link";

export default function tos() {
  return (
    <>
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
                    <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white"><span className="font-extrabold">Terms of Service</span></h2>
                    <p className="mb-4 font-bold">
                        Use of service
                    </p>
                    <p className="mb-4 font-light">
                        Use of Service: Our service is intended for personal use only. You may not use our service for any commercial or illegal purposes.
                    </p>
                    <p className="mb-4 font-bold">
                        Payment
                    </p>
                    <p className="mb-4 font-light">
                        Payment: You agree to pay the fees associated with our service. We reserve the right to change our fees at any time.
                    </p>
                    <p className="mb-4 font-bold"> 
                        Intellectual Property
                    </p>
                    <p className="mb-4 font-light">
                        Intellectual Property: We own all intellectual property associated with our service. You may not use our intellectual property without our express written consent.
                    </p>
                    <p className="mb-4 font-bold"> 
                        Disclimer of Warranties
                    </p>
                    <p className="mb-4 font-light">
                        Disclaimer of Warranties: Our service is provided "as is" and without warranty of any kind. We do not guarantee that our service will be error-free or uninterrupted.
                    </p>
                    <p className="mb-4 font-bold"> 
                        Limitation of Liability
                    </p>
                    <p className="mb-4 font-light">
                        Limitation of Liability: We are not liable for any damages arising from your use of our service, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
                    </p>
                    <p className="mb-4 font-bold"> 
                        Indemnification
                    </p>
                    <p className="mb-4 font-light">
                        Indemnification: You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of our service.
                    </p>
                    <p className="mb-4 font-bold"> 
                        Governing Law
                    </p>
                    <p className="mb-4 font-light">
                        Governing Law: These terms of service are governed by the laws of the jurisdiction in which we are based.
                    </p>
                    <p className="mb-4 font-bold"> 
                        Modification of Terms
                    </p>
                    <p className="mb-4 font-light">
                        Modification of Terms: We reserve the right to modify these terms of service at any time. We will notify you of any material changes to these terms.
                    </p>
                    <p className="mb-6 font-bold">
                    By using our service, you agree to these privacy policy and terms of service.
                    </p>

                    <Link href="/legal/privacy" className="inline-flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">
                        Privacy Policy
                        <svg className="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path></svg>
                    </Link>
                </div>
            </div>
        </section>
    </>
  );
}
