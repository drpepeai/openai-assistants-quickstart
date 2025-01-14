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
      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-500 hover:bg-zinc-500 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed"
    >
      Enter
    </button>
  );
}