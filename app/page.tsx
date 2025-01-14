"use client";

import React from "react";
import LoginButton from "./components/LoginButton";
import Chat from "./components/chat";
import { userIdAtom } from "./utils/atoms/userInfo";
import { useAtom } from "jotai";

export default function Home() {
  const [userId] = useAtom(userIdAtom);

  return (
    <div className={""}>
      {userId ?
        <Chat /> :
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <img src="/banner-no-bg.png" alt="banner" className="mx-auto w-1/2 h-1/2" />
          <div className="text-center">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white mt-4">
              Hello im Bryan (Demo)
            </h1>
            <p className="mt-2 text-pretty text-2xl font-medium text-zinc-500">
              Tell me how i can help you to live forever
            </p>
            <div className="mt-10 flex items-center justify-center">
              <LoginButton />
            </div>
          </div>
        </div>
      }
    </div>
  );
};