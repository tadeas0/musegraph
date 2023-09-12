import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createPlaylist } from "$lib/server/SpotifyClient";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const token = request.headers.get("Authorization");
    if (!token || token.split(" ")[0] !== "Bearer") {
        throw error(401, "missing bearer token");
    }

    if (data?.artists && data?.name) {
        try {
            const playlist = await createPlaylist(
                data.name,
                data.artists,
                token.split(" ")[1]
            );
            return json(playlist);
        } catch (err) {
            throw error(400, "could not create playlist");
        }
    }
    throw error(400, "invalid json");
};
