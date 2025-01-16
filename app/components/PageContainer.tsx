"use client"

import { useEffect, useState } from "react";
import { activeThreadIdAtom, threadIdsAtom, threadsAtom, userIdAtom } from "../utils/atoms/userInfo";
import { Provider, useAtom } from "jotai";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import SideBarContainer from "./SideBarContainer";
import { createThread } from "../utils";
import { fetchAllThreads } from "../utils";
import PopUpModal from "./PopUpModal";
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
const solanaConnectors = toSolanaWalletConnectors();

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
        externalWallets: {
          solana: { connectors: solanaConnectors }
        }
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
  const [show, setShow] = useState(false);

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
      <div className="hidden lg:block w-2/12 min-h-full">
        <SideBarContainer mobile={false} />
      </div>

      <main className="w-full lg:w-10/12 h-full flex flex-col justify-between overflow-y-auto">
        <div className="lg:hidden w-full flex flex-row justify-between">
          <span className="flex flex-row items-center px-4 sm:px-6 lg:px-8 pt-4">
            <img src="/logo.png" alt="logo" className="w-10 h-10" />
            <p className="text-white ml-2">Dr Pepe.ai</p>
          </span>
          <button
            className="text-customGray500 fixed top-3 right-0 bg-customNeutral100 z-50 rounded-full flex justify-center items-center w-12 h-12"
            onClick={() => setShow(true)}
          >
            <div className="block w-10 bg-transparent">
              <span
                aria-hidden="true"
                className={`block h-0.5 w-8 bg-white transform transition duration-500 ease-in-out rounded-3xl ${show ? "rotate-45 translate-y-0.5" : "-translate-y-2"}`}
              ></span>
              <span
                aria-hidden="true"
                className={`block h-0.5 w-8 bg-white transform transition duration-500 ease-in-out rounded-3xl ${show ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                aria-hidden="true"
                className={`block h-0.5 w-8 bg-white transform transition duration-500 ease-in-out rounded-3xl ${show ? "-rotate-45 -translate-y-0.5" : "translate-y-2"}`}
              ></span>
            </div>
          </button>

        </div>
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          {children}
        </div>

        <footer className="w-full flex flex-row justify-center items-center mt-24 pb-4 px-4 sm:px-6 lg:px-8">
          <p className="text-white">BRYAN can hallucinate. BRYAN can make mistakes. Always verify.</p>
        </footer>

        <div className="fixed z-100 left-0 md:hidden">
          <PopUpModal
            visible={show}
            onClosePopUpModal={() => setShow(false)}
            classNames="w-full md:hidden"
          >
            <SideBarContainer mobile={true} />
          </PopUpModal>
        </div>

      </main>
    </div >
  );
}