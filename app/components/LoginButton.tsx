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
      className="rounded-md bg-transparent  px-3.5 py-2.5 text-sm  text-md text-[#D1D1D1] shadow-sm ring-1 ring-inset ring-[#D1D1D1]  hover:bg-[#5BB8F0] disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed font-cascadia"
    >
      ENTER
    </button>
  );
}