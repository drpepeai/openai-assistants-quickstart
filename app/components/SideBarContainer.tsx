"use client";

import { useAtom } from "jotai";
import {
  userIdAtom,
  threadIdsAtom,
  threadsAtom,
  activeThreadIdAtom,
} from "../utils/atoms/userInfo";
import { usePrivy } from "@privy-io/react-auth";

export default function SideBarContainer({ mobile }) {
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
    localStorage.removeItem("threadCreationDates");
  }

  // Function to categorize threads
  function categorizeThreads() {
    const categories = {
      Today: [],
      Yesterday: [],
      "Last Week": [],
      Older: [],
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const threadCreationDates = JSON.parse(
      localStorage.getItem("threadCreationDates") || "{}"
    );

    threadIds.forEach((threadId) => {
      const creationDateStr = threadCreationDates[threadId];
      if (creationDateStr) {
        const creationDate = new Date(creationDateStr);
        if (isSameDay(creationDate, today)) {
          categories.Today.push(threadId);
        } else if (isSameDay(creationDate, yesterday)) {
          categories.Yesterday.push(threadId);
        } else if (creationDate > lastWeek) {
          categories["Last Week"].push(threadId);
        } else {
          categories.Older.push(threadId);
        }
      } else {
        // Handle threads without a stored creation date
        categories.Older.push(threadId);
      }
    });

    return categories;
  }

  // Helper function to check if two dates are the same day
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const categorizedThreads = categorizeThreads();

  return (
    <div className="w-full h-full flex flex-col justify-around text-[#D1D1D1] bg-[#181818] px-4 text-sm font-primary">
      {Object.keys(categorizedThreads).map((category) => (
        <div key={category} className="mb-4">
          <h3 className="text-[20px] text-[#5BB8F0] font-semibold">{category}</h3>
          {categorizedThreads[category].map((threadId) => (
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
                } mt-2 font-primary`}
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
      ))}
      {userId && (
        <div className=" mt-4 pt-4">
          <button
            className="w-24 h-10 right-2 pb-[2px] border-[#d1d1d1] text-[#d1d1d1] text-[14px] flex items-center justify-center rounded-[12px] shadow-md transition-all hover:border-[#5BB8F0] disabled:border-zinc-600 disabled:cursor-not-allowed leading-[0] font-primary mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
