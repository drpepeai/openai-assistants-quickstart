import { assistantId } from "./assistant-config";
import Warnings from "./components/warnings";
import "./globals.css";

export const metadata = {
  title: "Assistants API Quickstart",
  description: "A quickstart template using the Assistants API with OpenAI",
  icons: {
    icon: "/openai.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-black">
      <body className={"h-full"}>
        <div className="flex flex-row h-full">
          <div className="w-1/12 bg-gray-900 h-full px-4">
            <span className="flex flex-row items-center mt-4">
              <img src="/logo.png" alt="logo" className="w-10 h-10" />
              <p className="text-white ml-2">Dr Pepe.ai</p>
            </span>
          </div>

          <main className="w-11/12 h-full">
            <div className="px-4 sm:px-6 lg:px-8">{assistantId ? children : <Warnings />}</div>
          </main>
        </div >
      </body>
    </html >
  );
}