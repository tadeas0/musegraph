import { fetchArtist } from "$lib/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    const artistUrl = atob(params.artistId);
    const data = await fetchArtist(artistUrl, fetch);
    return data;
};
