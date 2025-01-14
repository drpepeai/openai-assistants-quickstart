"use client"

import { useAtom } from "jotai";
import { userIdAtom } from "../utils/atoms/userInfo";
import { usePrivy } from "@privy-io/react-auth";

export default function LoginButton() {
  const [userId, setUserId] = useAtom(userIdAtom);
  const { ready, authenticated, user, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  function handleLogin() {
    login();
  }

  return userId ? <></> : (
    <button
      disabled={disableLogin}
      onClick={handleLogin}
      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-500 hover:bg-zinc-500 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed"
    >
      Enter
    </button>
  );
}