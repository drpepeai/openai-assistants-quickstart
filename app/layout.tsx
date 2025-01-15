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
        <title>DrPepe.AI</title>
        <meta
          name="description"
          content="DrPepe is an AI-Powered SMART Agent"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type={"image/ico"} href="https://freight.cargo.site/t/original/i/C2119357503935211640175775296145/drpepe-logo-favicon.ico" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DrPepe.AI" />

        <meta name="twitter:description" content="DrPepe is an AI-Powered SMART Agent" />
        <meta name="twitter:image" content="https://freight.cargo.site/w/1000/i/H2165108033493999422276823788177/screenshot-3987544959.jpg" />
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