"use client"

import { useEffect, useState } from "react";
import { activeThreadIdAtom, threadIdsAtom, threadsAtom, userIdAtom } from "../utils/atoms/userInfo";
import { Provider, useAtom } from "jotai";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import SideBarContainer from "./SideBarContainer";
import { createThread } from "../utils";
import { fetchAllThreads } from "../utils";


export default function Page({ children }) {
  return (
    <PrivyProvider
      appId="cm5urnrtw0081n9ira2i2rx5z"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://openai-assistants-quickstart-alpha-five.vercel.app/logo.png',
          landingHeader: 'Hello im Bryan (Demo)',
          loginMessage: 'Tell me how i can help you to live forever',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <PageContainer>
        {children}
      </PageContainer>
    </PrivyProvider>
  );
}

function PageContainer({ children }) {
  const [userId, setUserId] = useAtom(userIdAtom);
  const [threadIds, setThreadIds] = useAtom(threadIdsAtom);
  const [activeThreadId, setActiveThreadId] = useAtom(activeThreadIdAtom);
  const [threads, setThreads] = useAtom(threadsAtom);
  const { ready, authenticated, user } = usePrivy();

  // Read userId from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');

      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  // Write userId to localStorage when user is logged in
  useEffect(() => {
    if (ready && authenticated && user) {
      localStorage.setItem('userId', user.id);
      setUserId(user.id);
    }
  }, [ready, authenticated, user]);

  // Read threadIds from localStorage
  useEffect(() => {
    async function setUp() {
      const storedThreadIds = localStorage.getItem('threadIds');

      let newThreads = {};

      if (storedThreadIds) {
        newThreads = await fetchAllThreads(storedThreadIds);
      }

      const newThreadId = await createThread();
      newThreads[newThreadId] = { threadId: newThreadId, messages: [] };

      setThreads(newThreads);
      setActiveThreadId(newThreadId);
      setThreadIds([...Object.keys(newThreads)]);

      localStorage.setItem('threadIds', [...Object.keys(newThreads)].join(','));
    }

    if (typeof window !== 'undefined') {
      setUp();
    }
  }, [userId]);


  return (
    <div className="flex flex-row h-screen min-h-full">
      <div className="w-2/12 min-h-full">
        <SideBarContainer />
      </div>

      <main className="w-10/12 h-full flex flex-col justify-between overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          {children}
        </div>
        <footer className="w-full flex flex-row justify-center items-center mt-24 pb-4">
          <p className="text-white">BRYAN can hallucinate. BRYAN can make mistakes. Always verify.</p>
        </footer>
      </main>
    </div >
  );
}