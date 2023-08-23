import type { Artist } from "./Artist";

export interface ArtistSimilar {
    artist: Artist;
    similarArtists: Artist[];
}
