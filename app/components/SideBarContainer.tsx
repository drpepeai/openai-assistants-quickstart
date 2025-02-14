"use client";

import { useAtom } from "jotai";
import {
  userIdAtom,
  threadIdsAtom,
  threadsAtom,
  activeThreadIdAtom,
} from "../utils/atoms/userInfo";
import { usePrivy } from "@privy-io/react-auth";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SideBarContainer({ mobile, isOpen, toggleSidebar }) {
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
    <div className="w-full h-full flex flex-col justify-around text-[#D1D1D1] bg-[#181818] px-4 text-sm font-primary">
      <div className="flex flex-col mb-4">
        {threadIds.map((threadId) => (
          <div
            key={threadId}
            onClick={() => setActiveThreadId(threadId)}
            className="cursor-pointer font-primary"
          >
            <p
              className={`${
                activeThreadId === threadId
                  ? "text-[#D1D1D1]"
                  : "text-zinc-500"
              } mt-4 font-primary`}
            >
              {threads[threadId].messages.length > 0
                ? threads[threadId].messages[0].text.split(" ").length > 7
                  ? threads[threadId].messages[0].text
                      .split(" ")
                      .slice(0, 7)
                      .join(" ") + "..."
                  : threads[threadId].messages[0].text
                : "Current Thread"}
            </p>
          </div>
        ))}
      </div>
      {userId && (
        <div className="border-t border-zinc-500">
          <button
            className="w-24 h-10 right-2 pb-[2px] border-[#d1d1d1] text-[#d1d1d1] text-[14px] flex items-center justify-center rounded-[12px] shadow-md transition-all hover:border-[#5BB8F0] disabled:border-zinc-600 disabled:cursor-not-allowed leading-[0] font-primary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
