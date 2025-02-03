import { Provider } from "jotai";
import PageContainer from "./components/PageContainer";
import { Courier_Prime, Roboto } from 'next/font/google';
import "./globals.css";
import Head from "next/head";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full bg-black ${roboto.className} ${courierPrime.className}`}>
      <Head>
        <title>DrPepe.ai Agent</title>
        <meta name="description" content="DrPepe is an AI-Powered SMART Agent" />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        <meta property="og:url" content="https://drpepe.ai" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="DrPepe.ai Agent" />
        <meta property="og:description" content="DrPepe is an AI-Powered SMART Agent" />
        <meta property="og:image" content="/banner.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="drpepe.ai" />
        <meta property="twitter:url" content="https://drpepe.ai" />
        <meta name="twitter:title" content="DrPepe.ai Agent" />
        <meta name="twitter:description" content="DrPepe is an AI-Powered SMART Agent" />
        <meta name="twitter:image" content="/banner.jpg" />
      </Head>
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