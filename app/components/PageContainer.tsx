"use client"

import { useEffect, useState } from "react";
import { threadIdsAtom, threadsAtom, userIdAtom } from "../utils/atoms/userInfo";
import { Provider, useAtom } from "jotai";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import SideBarContainer from "./SideBarContainer";


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
    console.log({ ready, authenticated, user });
    if (ready && authenticated && user) {
      localStorage.setItem('userId', user.id);
      setUserId(user.id);
    }
  }, [ready, authenticated, user]);


  async function fetchAllThreads(storedThreadIds: string) {
    const allThreadIds = storedThreadIds.split(',');

    const allThreads = await Promise.all(allThreadIds.map(async threadId => fetchThreadStatus(threadId)));

    const filteredThreads = allThreads.filter(thread => thread.messages.length > 0);
    const filteredThreadIds = filteredThreads.map(thread => thread.threadId);

    const newThreads = {}
    filteredThreads.forEach(thread => {
      newThreads[thread.threadId] = thread;
    });

    setThreadIds(filteredThreadIds);
    setThreads(newThreads);
  }

  // Read threadIds from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedThreadIds = localStorage.getItem('threadIds');

      if (storedThreadIds) {
        fetchAllThreads(storedThreadIds);

        // localStorage.setItem('threadIds', filteredThreadIds.join(','));

      }
    }
  }, [userId]);


  async function fetchThreadStatus(threadId) {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (data.messages.data.length > 0) {
      return {
        threadId, messages: data.messages.data.map(message => {
          return {
            role: message.role,
            text: message.content[0].text.value,
          }
        }).reverse()
      }
    } else {
      return { threadId, messages: [] }
    }
  }

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