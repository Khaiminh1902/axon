import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  )
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
})

export default function ClerkAndConvexProvider({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <ClerkLoaded>
                {children}
            </ClerkLoaded>
        </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}