import type { StackState } from "$lib/stores/SessionStore";

export interface Session {
    id: string;
    artistStack: StackState[];
}
