"use client";

import { useRouter } from "next/navigation";
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
        <LoginButton />
      }
    </div>
  );
};