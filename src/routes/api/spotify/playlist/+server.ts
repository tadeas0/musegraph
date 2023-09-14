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
            if (
                typeof err === "object" &&
                err &&
                "statusCode" in err &&
                err.statusCode === 403
            ) {
                throw error(403, "user not part of beta testing");
            } else if (
                typeof err === "object" &&
                err &&
                "statusCode" in err &&
                typeof err.statusCode === "number" &&
                "body" in err &&
                typeof err.body === "object" &&
                err.body &&
                "error" in err.body &&
                typeof err.body.error === "object" &&
                err.body.error &&
                "message" in err.body.error &&
                typeof err.body.error.message === "string" &&
                err.body.error.message
            ) {
                throw error(err.statusCode, err.body.error.message);
            } else {
                console.error(err);
                throw error(500, "server error");
            }
        }
    }
    throw error(400, "invalid json");
};
