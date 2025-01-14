"use client"

import { useAtom } from "jotai";
import { userIdAtom, threadIdsAtom, threadsAtom } from "../utils/atoms/userInfo";

export default function SideBarContainer() {
  const [userId, setUserId] = useAtom(userIdAtom);
  const [threadIds, setThreadIds] = useAtom(threadIdsAtom);
  const [threads, setThreads] = useAtom(threadsAtom);

  return (
    <div className="w-full h-full bg-zinc-800 px-4">
      <span className="flex flex-row items-center pt-4">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <p className="text-white ml-2">Dr Pepe.ai</p>
      </span>
      <div className="flex flex-col">
        {
          threadIds.map((threadId) => (
            <p className="text-white mt-4">{threads[threadId] ? threads[threadId].messages[0].content : "Current Thread"}</p>
          ))
        }
      </div>
    </div>
  );
}
