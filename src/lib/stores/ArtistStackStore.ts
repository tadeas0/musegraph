import type { Artist } from "$lib/types/Artist";
import { writable } from "svelte/store";

interface StackState {
    artist: Artist;
    similarArtists: Artist[];
}

export function createArtistStack() {
    const { subscribe, set, update } = writable<StackState[]>([]);

    return {
        subscribe,
        add: (newState: StackState) => update((s) => [...s, newState]),
        popLast: () => update((s) => s.slice(0, -1)),
        clear: () => set([])
    };
}

export type ArtistStackStore = ReturnType<typeof createArtistStack>;
