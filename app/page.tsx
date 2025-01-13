"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  return (
    <main className={""}>
      <div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <img src="/banner-no-bg.png" alt="banner" className="mx-auto w-1/2 h-1/2" />
          <div className="text-center">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white mt-4">
              Hello im Bryan (Demo)
            </h1>
            <p className="mt-2 text-pretty text-2xl font-medium text-gray-500">
              Tell me how i can help you to live forever
            </p>
            <div className="mt-10 flex items-center justify-center">
              <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  router.push('/examples/basic-chat');
                }}>
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};