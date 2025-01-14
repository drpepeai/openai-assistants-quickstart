import { Provider } from "jotai";
import PageContainer from "./components/PageContainer";
import { Courier_Prime, Roboto } from 'next/font/google';
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '700'],  // specify the weights you need
  subsets: ['latin'],   // specify the character sets
  variable: '--font-roboto' // specify the variable name
});

const courierPrime = Courier_Prime({
  weight: ['400', '700'],  // specify the weights you need
  subsets: ['latin'],   // specify the character sets
  variable: '--font-courier-prime' // specify the variable name
});

export const metadata = {
  title: "Assistants API Quickstart",
  description: "A quickstart template using the Assistants API with OpenAI",
  icons: {
    icon: "/openai.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full bg-black ${roboto.className} ${courierPrime.className}`}>
      <body className={"h-full font-courierPrime"}>
        <Provider>
          <PageContainer>
            {children}
          </PageContainer>
        </Provider>
      </body>
    </html >
  );
}