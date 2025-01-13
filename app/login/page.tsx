"use client";

import { PrivyProvider } from "@privy-io/react-auth"
import {usePrivy} from '@privy-io/react-auth';

export default function Login() {
  return (
    <PrivyProvider
      appId="cm5urnrtw0081n9ira2i2rx5z"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <LoginContainer />
    </PrivyProvider>
  )
}


function LoginContainer() {
  return (
    <div>
      <LoginButton />
    </div>
  )
}

function LoginButton() {
  const {ready, authenticated, login} = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <button disabled={disableLogin} onClick={login}>
      Log in
    </button>
  );
}