import type { Song } from "./Song";

export interface SpotifyData {
    artistUrl: string;
    image?: string;
    song: Song;
}
