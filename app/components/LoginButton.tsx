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
    <button disabled={disableLogin} onClick={handleLogin} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      Log in
    </button>
  );
}