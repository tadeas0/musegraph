import { browser } from "$app/environment";
import type { SpotifyProfile } from "$lib/types/SpotifyProfile";
import { writable } from "svelte/store";

export interface SpotifyToken {
    expiration: Date;
    token: string;
}

export type SignedInUser = SpotifyProfile & { token: SpotifyToken };

const SPOTIFY_USER_KEY = "spotifyUser";

export function createUserStore() {
    let user: SignedInUser | null = null;
    if (browser) {
        try {
            const storageUser = localStorage.getItem(SPOTIFY_USER_KEY);
            if (storageUser) {
                // Check if the token is valid and if not, set it to null
                const parsed = JSON.parse(storageUser);
                const token = {
                    expiration: new Date(parsed.token.expiration),
                    token: parsed.token.token
                };
                user = {
                    displayName: parsed.displayName,
                    token,
                    url: parsed.url,
                    image: parsed.image
                };
            }
        } catch (err) {
            user = null;
            localStorage.setItem(SPOTIFY_USER_KEY, JSON.stringify(null));
        }
    }

    const { subscribe, set } = writable<SignedInUser | null>(user);

    return {
        subscribe: subscribe,
        set: (val: SignedInUser) => {
            localStorage.setItem(SPOTIFY_USER_KEY, JSON.stringify(val));
            set(val);
        }
    };
}

export const spotifyUserStore = createUserStore();
