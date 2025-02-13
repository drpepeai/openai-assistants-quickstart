"use client"

import { useAtom } from "jotai";
import { userIdAtom, threadIdsAtom, threadsAtom, activeThreadIdAtom } from "../utils/atoms/userInfo";
import { usePrivy } from "@privy-io/react-auth";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SideBarContainer({ mobile }: { mobile: boolean }) {
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
    <div className="w-full h-vh text-[#D1D1D1] bg-[#212121]  px-4 font-primary">
  
      <div className="flex flex-col mb-4">
        {threadIds.map((threadId) => (

          <div key={threadId} onClick={() => setActiveThreadId(threadId)} className="cursor-pointer font-primary">
            <p className={`${activeThreadId === threadId ? "text-[#D1D1D1]" : "text-zinc-500"} mt-4 font-primary`}>
              {threads[threadId].messages.length > 0 ? `${threads[threadId].messages[0].text.split(" ").length > 7 ? threads[threadId].messages[0].text.split(" ").slice(0, 7).join(" ") + "..." : threads[threadId].messages[0].text}` : "Current Thread"}
            </p>
          </div>
        ))
        }
      </div>
      {userId &&
        <div className="border-t border-zinc-500">
          <button
            className="mt-4 rounded-m px-3.5 py-2.5 text-sm  text-[#D1D1D1] bg-[#212121]  shadow-sm ring-1 ring-inset ring-zinc-500 hover:bg-zinc-500 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed font-primary"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      }
    </div>
  );
}
