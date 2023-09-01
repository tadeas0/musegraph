import { updateSession } from "$lib/api";
import { get, writable } from "svelte/store";
import type { StackState } from "./ArtistStackStore";

export function createSessionStore(sessionId: string) {
    const store = writable<StackState[]>([]);
    const { subscribe, set, update } = store;

    return {
        subscribe,
        add: async (newState: StackState) => {
            const oldState = get(store);
            update((n) => [...n, newState]);
            await updateSession(sessionId, [...oldState, newState]);
        },
        popLast: async () => {
            const oldState = get(store);
            update((s) => s.slice(0, -1));
            await updateSession(sessionId, oldState.slice(0, -1));
        },
        clear: async () => {
            set([]);
            await updateSession(sessionId, []);
        },
        set: async (state: StackState[]) => {
            set(state);
            await updateSession(sessionId, state);
        }
    };
}

export type SessionStore = ReturnType<typeof createSessionStore>;
