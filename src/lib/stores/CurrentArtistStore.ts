import { derived, type Readable } from "svelte/store";
import { artistStack } from "./ArtistStackStore";
import type { ArtistSimilar } from "$lib/types/ArtistSimilar";

const PLACEHOLDER_ARTIST: ArtistSimilar = {
    artist: { dbpediaUrl: "", genres: [], name: "artist" },
    similarArtists: []
};

export const currentArtist: Readable<ArtistSimilar> = derived(
    artistStack,
    ($artistStack) => {
        return $artistStack.at(-1) || PLACEHOLDER_ARTIST;
    }
);
