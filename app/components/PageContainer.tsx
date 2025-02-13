"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { activeThreadIdAtom, threadIdsAtom, threadsAtom, userIdAtom } from "../utils/atoms/userInfo";
import { useAtom } from "jotai";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import SideBarContainer from "./SideBarContainer";
import { createThread, fetchAllThreads } from "../utils";
import PopUpModal from "./PopUpModal";
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import titlelogo from "../../public/title-logo.svg";
import wiredlogo from "../../public/wiredlogo.svg";

const solanaConnectors = toSolanaWalletConnectors();

export default function Page({ children }) {
  return (
    <PrivyProvider
      appId="cm5urnrtw0081n9ira2i2rx5z"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://openai-assistants-quickstart-alpha-five.vercel.app/logo.png',
          landingHeader: 'Hello, I am Bryan (Demo)',
          loginMessage: 'Tell me how I can help you live forever',
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  useEffect(() => {
    if (ready && authenticated && user) {
      localStorage.setItem('userId', user.id);
      setUserId(user.id);
    }
  }, [ready, authenticated, user]);

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

    if (typeof window !== 'undefined' && userId) {
      setUp();
    }
  }, [userId]);

  return (
    <div className="relative flex flex-row min-h-full h-dvh overflow-y-hidden">
      {/* Sidebar */}
      {userId && (
        <div className="hidden lg:block w-2/12 h-vh relative z-10">
          <SideBarContainer mobile={false} />
        </div>
      )}

      {/* Main Content */}
      <main className="w-full lg:w-full h-full flex flex-col justify-between overflow-y-auto relative z-10">
        {/* Header */}
        <div className="w-full flex flex-row justify-between items-center px-4 sm:px-6 lg:px-8 pt-4">
          {/* First Image */}
          <span className="flex flex-row items-center">
            <Image
              onClick={() => window.open('https://www.drpepe.ai/')}
              src={titlelogo}
              alt="logo"
              className="h-6 w-auto object-contain cursor-crosshair"
            />
          </span>

          {/* Second Image (Clickable) */}
          <div className="h-12 w-auto cursor-pointer" onClick={() => setShow(true)}>
            <Image src={wiredlogo} alt="logo" className="h-12 w-auto object-contain" />
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4">{children}</div>

        {/* Footer */}
        <footer className="w-full flex flex-row justify-center items-center pb-4 px-4 sm:px-6 lg:px-8">
          <p className="text-[#D1D1D1] text-center text-xs">
            DrPepe.ai can hallucinate, always verify.
          </p>
        </footer>

        {/* Mobile Sidebar */}
        {userId && (
          <div className="fixed z-100 left-0 md:hidden">
            <PopUpModal
              visible={show}
              onClosePopUpModal={() => setShow(false)}
              classNames="w-full md:hidden"
            >
              <SideBarContainer mobile={true} />
            </PopUpModal>
          </div>
        )}
      </main>
    </div>
  );
}
