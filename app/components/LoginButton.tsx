"use client"

import { useAtom } from "jotai";
import { userIdAtom } from "../utils/atoms/userInfo";
import { usePrivy } from "@privy-io/react-auth";

export default function LoginButton() {
  const [userId, setUserId] = useAtom(userIdAtom);
  const { ready, authenticated, user, login, logout } = usePrivy();

  function handleLogin() {
    console.log("login");
    login();
  }

  return userId ? <></> : (
<button
  disabled={!ready}
  onClick={handleLogin}
  className="w-24 h-10  right-2 pb-[2px] bg-[#6CC9FE] text-[#303030] text-xl flex items-center justify-center rounded-[12px] shadow-md transition-all hover:bg-[#5BB8F0] disabled:bg-zinc-600 disabled:cursor-not-allowed leading-[0] font-primary"

>


Enter
</button>
  );
}