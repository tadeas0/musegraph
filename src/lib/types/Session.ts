import type { StackState } from "$lib/stores/ArtistStackStore";

export interface Session {
    id: string;
    artistStack: StackState[];
}
