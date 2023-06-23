import { fetchArtist } from "$lib/api";
import type { Artist } from "$lib/types/Artist";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad<{
    artist: Artist;
    similarArtists: Artist[];
}> = async ({ fetch, params }) => {
    const artistUrl = atob(params.artistId);
    const data = await fetchArtist(artistUrl, fetch);
    return data;
};
