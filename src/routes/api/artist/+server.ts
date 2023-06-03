import { getArtistsByName } from "$lib/DBPediaClient";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
    const artistName = url.searchParams.get("name");
    if (artistName === null) {
        throw error(400, "missing name parameter");
    }
    const artists = await getArtistsByName(artistName);
    return json({ artists });
};
