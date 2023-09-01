import { browser } from "$app/environment";
import type { ArtistSimilar } from "$lib/types/ArtistSimilar";
import { writable } from "svelte/store";

export type StackState = ArtistSimilar;

function createArtistStack() {
    const { subscribe, set, update } = writable<StackState[]>([]);

    const artistStackId = "artistStack";

    function getStorageStack() {
        const item = localStorage.getItem(artistStackId);
        if (item !== null) {
            return JSON.parse(item);
        } else {
            return [];
        }
    }

    if (browser) {
        const localStack = getStorageStack();
        set(localStack);
    }

    return {
        subscribe,
        add: (newState: StackState) => {
            if (browser) {
                const localStack = getStorageStack();
                const newStack = [...localStack, newState];
                localStorage.setItem(artistStackId, JSON.stringify(newStack));
                set(newStack);
            } else {
                update((n) => [...n, newState]);
            }
        },
        popLast: () => {
            if (browser) {
                const localStack = getStorageStack();
                const newStack = localStack.slice(0, -1);
                localStorage.setItem(artistStackId, JSON.stringify(newStack));
                set(newStack);
            } else {
                update((s) => s.slice(0, -1));
            }
        },
        clear: () => {
            if (browser) {
                localStorage.setItem(artistStackId, JSON.stringify([]));
            }
            set([]);
        },
        set: (state: StackState[]) => {
            if (browser) {
                localStorage.setItem(artistStackId, JSON.stringify(state));
            }
            set(state);
        }
    };
}

export type ArtistStackStore = ReturnType<typeof createArtistStack>;

export const artistStack = createArtistStack();
