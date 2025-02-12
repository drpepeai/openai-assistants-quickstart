"use client"

import { useAtom } from "jotai";
import { userIdAtom, threadIdsAtom, threadsAtom, activeThreadIdAtom } from "../utils/atoms/userInfo";
import { usePrivy } from "@privy-io/react-auth";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import titlelogo from "../../public/title-logo.svg";

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
    <div className="w-full h-full bg-zinc-800 px-4">
      {!mobile &&
        <span className="flex flex-row items-center pt-4">
            <Image src={titlelogo} alt="logo" className="w-100 " />
        </span>
      }
      <div className="flex flex-col mb-4">
        {threadIds.map((threadId) => (

          <div key={threadId} onClick={() => setActiveThreadId(threadId)} className="cursor-pointer">
            <p className={`${activeThreadId === threadId ? "text-white" : "text-zinc-500"} mt-4`}>
              {threads[threadId].messages.length > 0 ? `${threads[threadId].messages[0].text.split(" ").length > 7 ? threads[threadId].messages[0].text.split(" ").slice(0, 7).join(" ") + "..." : threads[threadId].messages[0].text}` : "Current Thread"}
            </p>
          </div>
        ))
        }
      </div>
      {userId &&
        <div className="border-t border-zinc-500">
          <button
            className="mt-4 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-500 hover:bg-zinc-500 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      }
    </div>
  );
}
