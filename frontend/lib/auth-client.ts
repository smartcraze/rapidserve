"use client";

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
})

const GOOGLE_POPUP_FEATURES = "popup=yes,width=520,height=700,left=0,top=0";

export async function signInWithGooglePopup(callbackURL = "/deploy") {
    const popup = window.open("", "rapidserve-google-signin", GOOGLE_POPUP_FEATURES);

    try {
        const { data, error } = await authClient.signIn.social({
            provider: "google",
            callbackURL,
            disableRedirect: true,
        });

        if (error) {
            throw error;
        }

        const authorizationUrl = data?.url;

        if (!authorizationUrl) {
            throw new Error("Google sign-in did not return an authorization URL.");
        }

        if (!popup) {
            window.location.assign(authorizationUrl);
            return;
        }

        popup.location.href = authorizationUrl;
        popup.focus();
    } catch (error) {
        popup?.close();
        throw error;
    }
}

