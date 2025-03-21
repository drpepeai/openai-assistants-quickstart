"use client";

  import { useAtom } from "jotai";
  import {
    userIdAtom,
    threadIdsAtom,
    threadsAtom,
    activeThreadIdAtom,
  } from "../utils/atoms/userInfo";
  import { usePrivy } from "@privy-io/react-auth";
  import { XMarkIcon, Bars3Icon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";

  
  export default function SideBarContainer({ mobile, toggleSidebar, isOpen }) {
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
    <div className="relative">
      {/* Toggle Button */}
      <div className="fixed bottom-[18px]  left-[1.8rem] z-50 flex flex-row gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-800 text-white rounded-lg"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        {userId && (
          <button
            onClick={handleLogout}
            className="p-2 bg-gray-800 text-white rounded-lg flex justify-center items-center gap-2"
          >
            <ArrowRightCircleIcon className="h-6 w-6" /> 
          </button>
        )}
      </div>

      {/* Sidebar */}
      {isOpen && (
        <div className="min-w-[300px] z-30 h-full pt-[7rem] fixed left-0 top-0 bg-[#181818] text-[#D1D1D1] px-[1.8rem] pr-0 text-sm font-primary flex flex-col justify-start transition-transform duration-300">
            <div className="flex h-[30rem] overflow-scroll flex-col mb-4">
     
              <div className="text-[#5BB8F0] text-[14px] font-primary mb-2">Threads</div>

              <div
                onClick={() => setActiveThreadId(null)} 
                className="cursor-pointer font-primary text-zinc-500 mt-2"
              >
              </div>

           
              {threadIds.slice(1).reverse().map((threadId) => (
                <div
                  key={threadId}
                  onClick={() => setActiveThreadId(threadId)}
                  className="cursor-pointer font-primary"
                >
                  <p
                    className={`mt-4 font-primary ${
                      activeThreadId === threadId ? "text-[#D1D1D1]" : "text-zinc-500"
                    }`}
                  >
                    {threads[threadId]?.messages?.[0]?.text
                      ? threads[threadId].messages[0].text.split(" ").slice(0, 7).join(" ") + "..."
                      : "New Chat"}
                  </p>
                </div>
              ))}
            </div>

        </div>
      )}
    </div>
  );
}