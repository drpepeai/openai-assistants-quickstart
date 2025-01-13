"use client"

import { useState } from "react";
import { assistantId } from "../assistant-config";
import Warnings from "./warnings";


export default function PageContainer({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  return (
    <div className="flex flex-row">
      <div className="w-1/5">
      </div>

      <main className="py-10 w-4/5">
        <div className="px-4 sm:px-6 lg:px-8">{assistantId ? children : <Warnings />}</div>
      </main>
    </div >
  );
}