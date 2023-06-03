import { getArtistByUrl, getSimilarArtists } from "$lib/DBPediaClient";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
    const artistUrl = atob(params.artistId);
    const [artist, similar] = await Promise.all([
        getArtistByUrl(artistUrl),
        getSimilarArtists(artistUrl)
    ]);
    return json({ artist: artist, similarArtists: similar });
};
