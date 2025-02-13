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

        <Chat /> :
        <div className="mx-auto max-w-2xl  ">
          <div className="text-center">
            <div className="text-4xl text-[#D1D1D1] mt-4">
              Hello I am DrPepe.ai 
            </div>
            <div className="mt-2 text-pretty text-md text-[#D1D1D1]">
              Tell me how I can help you live forever
            </div>
            <div className="mt-10 flex items-center justify-center">
              <LoginButton />
            </div>
          </div>
        </div>
   
    </div>
  );
};