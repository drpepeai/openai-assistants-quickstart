"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { userIdAtom } from "../utils/atoms/userInfo";
import { useAtom } from "jotai";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import SideBarContainer from "./SideBarContainer";
import titlelogo from "../../public/title-logo.svg";
import wiredlogo from "../../public/wiredlogo.svg";

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
  const [isOpen, setIsOpen] = useState(true);
  const { ready, authenticated, user } = usePrivy();

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

  return (
    <div className="relative flex flex-row min-h-full h-screen overflow-hidden bg-[#212121]">
      {/* Sidebar */}
      <SideBarContainer isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} mobile={undefined} />

      {/* Main Content - Adjusts width dynamically */}
      <main
        className="h-full flex flex-col justify-between overflow-y-auto transition-all duration-300 bg-[#212121]"
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

        {/* Page Content */}
        <div className="h-full px-4 sm:px-6 lg:px-8 mt-[5rem] flex flex-col justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}