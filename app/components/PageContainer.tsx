"use client"

import { useEffect, useState, useRef } from "react";

import Image from "next/image";
import { activeThreadIdAtom, threadIdsAtom, threadsAtom, userIdAtom } from "../utils/atoms/userInfo";
import { Provider, useAtom } from "jotai";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import SideBarContainer from "./SideBarContainer";
import { createThread } from "../utils";
import { fetchAllThreads } from "../utils";
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
  const gridRef = useRef<HTMLDivElement>(null); // Next.js-safe reference


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

   // Grid
   useEffect(() => {
    if (!gridRef.current) return;

    const gridItems = gridRef.current.querySelectorAll(".grid-item");

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      gridItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distanceX = clientX - (rect.left + rect.width / 2);
        const distanceY = clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(distanceX, distanceY);

        const maxDistance = 200;
        const intensity = 1 - Math.min(distance / maxDistance, 1);

        const translateX = -intensity * (distanceX / distance) * 20;
        const translateY = -intensity * (distanceY / distance) * 20;

        (item as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };

    const handleMouseLeave = () => {
      gridItems.forEach((item) => {
        (item as HTMLElement).style.transform = "translate(0, 0)";
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);


  return (


<div className="relative flex flex-row h-screen min-h-full min-h-[100dvh] min-h-[100vh] min-h-[100%] overflow-hidden border border-color-blue">

  {/* Elastic Grid Background */}
  <div
    ref={gridRef}
    className="absolute top-0 left-0 w-full h-full grid grid-cols-8 gap-px z-0 pointer-events-none"
  >
    {[...Array(64)].map((_, index) => (
      <div
        key={index}
        className="grid-item border border-white/10 bg-transparent transition-transform duration-500 ease-out"
      />
    ))}
  </div>

  {/* Sidebar */}
  <div className="hidden lg:block w-2/12 h-full relative z-10">
    <SideBarContainer mobile={false} />
  </div>

  {/* Main Content */}
  <main className="w-full lg:w-10/12 h-full flex flex-col justify-between overflow-y-auto relative z-10">
    {/* Header */}
    <div className="w-full flex flex-row justify-between items-center px-4 sm:px-6 lg:px-8 pt-4">
      {/* First Image */}
      <span className="flex flex-row items-center">
        <Image src={titlelogo} alt="logo" className="h-6 w-auto object-contain" />
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
        DrPepe.ai can hallucinate. DrPepe.ai can make mistakes. Always verify.
      </p>
    </footer>

    {/* Mobile Sidebar */}
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
</div>

  );
}
