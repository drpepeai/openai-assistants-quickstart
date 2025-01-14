"use client"

import { useAtom } from "jotai";
import { userIdAtom, threadIdsAtom, threadsAtom, activeThreadIdAtom } from "../utils/atoms/userInfo";
import { usePrivy } from "@privy-io/react-auth";

export default function SideBarContainer() {
  const [userId, setUserId] = useAtom(userIdAtom);
  const [threadIds, setThreadIds] = useAtom(threadIdsAtom);
  const [activeThreadId, setActiveThreadId] = useAtom(activeThreadIdAtom);
  const [threads, setThreads] = useAtom(threadsAtom);
  const { logout } = usePrivy();

  function handleLogout() {
    logout();
    setUserId(null);
    setThreadIds([]);
    setThreads({});
  }

  return (
    <div className="w-full h-full bg-zinc-800 px-4">
      <span className="flex flex-row items-center pt-4">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <p className="text-white ml-2">Dr Pepe.ai</p>
      </span>
      {userId &&
        <button
          className="mt-4 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-500 hover:bg-zinc-500 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed"
          onClick={handleLogout}>
          Logout
        </button>
      }
      <div className="flex flex-col">
        {threadIds.map((threadId) => (
          <div key={threadId} onClick={() => setActiveThreadId(threadId)} className="cursor-pointer">
            <p className={`${activeThreadId === threadId ? "text-white" : "text-zinc-500"} mt-4`}>{threads[threadId].messages.length > 0 ? threads[threadId].messages[0].text : "Current Thread"}</p>
          </div>
        ))
        }
      </div>
    </div>
  );
}
