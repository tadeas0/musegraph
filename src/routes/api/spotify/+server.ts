import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getSpotifyData } from "$lib/server/SpotifyClient";

export const GET: RequestHandler = async ({ url }) => {
    const artist = url.searchParams.get("artist");
    if (!artist) throw error(400, "missing artist");
    const song = await getSpotifyData(artist);
    if (song === null) throw error(404, "no available previews");

    return json(song);
};
