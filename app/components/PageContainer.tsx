"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { userIdAtom, activeThreadIdAtom, threadIdsAtom, threadsAtom, } from "../utils/atoms/userInfo";
import { useAtom } from "jotai";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import SideBarContainer from "./SideBarContainer";
import { createThread, fetchAllThreads } from "../utils";
import PopUpModal from "./PopUpModal";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import titlelogo from "../../public/title-logo.svg";
import wiredlogo from "../../public/wiredlogo.svg";


const solanaConnectors = toSolanaWalletConnectors();


export default function Page({ children }) {
  return (
    <PrivyProvider
      appId="cm5urnrtw0081n9ira2i2rx5z"
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          logo: "https://openai-assistants-quickstart-alpha-five.vercel.app/logo.png",
          landingHeader: "Hello, I am Bryan (Demo)",
          loginMessage: "Tell me how I can help you live forever",
        },
        externalWallets: {
          solana: { connectors: solanaConnectors },
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
  const [isOpen, setIsOpen] = useState(true);
  const { ready, authenticated, user } = usePrivy();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  useEffect(() => {
    if (ready && authenticated && user) {
      localStorage.setItem("userId", user.id);
      setUserId(user.id);
    }
  }, [ready, authenticated, user]);

  // Load or create threads
  useEffect(() => {
    async function setUp() {
      const storedThreadIds = localStorage.getItem("threadIds");
      let newThreads = {};
      if (storedThreadIds) {
        newThreads = await fetchAllThreads(storedThreadIds);
      }
      const newThreadId = await createThread();
      newThreads[newThreadId] = { threadId: newThreadId, messages: [] };
      setThreads(newThreads);
      setActiveThreadId(newThreadId);
      setThreadIds([...Object.keys(newThreads)]);
      localStorage.setItem("threadIds", [...Object.keys(newThreads)].join(","));
    }
    if (typeof window !== "undefined" && userId) {
      setUp();
    }
  }, [userId]);
  // Toggle sidebar state
  const toggleSidebar = () => setIsOpen((prev) => !prev);


  return (
    <div className="relative flex flex-row h-screen overflow-hidden bg-[#212121]">
      {/* Sidebar */}
      <SideBarContainer isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} mobile={undefined} />

      {/* Main Content - Adjusts width dynamically */}
      <main
        className="h-full flex flex-col justify-between overflow-hidden no-scrollbar transition-all duration-300 bg-[#212121]"
        style={{
          width: isOpen ? "80vw" : "100vw",
          marginLeft: isOpen ? "20vw" : "0",
        }}
      >
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full flex flex-row justify-between items-center px-4 sm:px-6 lg:px-8 py-4 bg-transparent z-50">
          <span className="flex flex-row items-center">
            <Image
              onClick={() => window.open("https://www.drpepe.ai/")}
              src={titlelogo}
              alt="logo"
              className="h-6 w-auto object-contain cursor-crosshair"
            />
          </span>
          <div className="h-12 w-auto cursor-pointer">
            <Image src={wiredlogo} alt="logo" className="h-12 w-auto object-contain" />
          </div>
        </div>

         {/* Mobile Sidebar */}
         {userId && (
            <div className="fixed z-100 left-0 md:hidden">
              <PopUpModal visible={show} onClosePopUpModal={() => setShow(false)} classNames="w-full md:hidden">
                <SideBarContainer mobile={true} isOpen={false} toggleSidebar={false} />
              </PopUpModal>
            </div>
          )}
 

        {/* Page Content */}
        <div className="h-[85vh] px-4 sm:px-6 lg:px-8 mt-[5rem] pt-[3rem] flex flex-col justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}