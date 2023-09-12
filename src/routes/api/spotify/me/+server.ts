import { getCurrentUser } from "$lib/server/SpotifyClient";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import type { SpotifyProfile } from "$lib/types/SpotifyProfile";

export const GET: RequestHandler = async ({ request }) => {
    const bearer = request.headers.get("Authorization");
    if (!bearer || bearer.split(" ")[0] !== "Bearer") {
        throw error(401, "user not logged in");
    }

    const token = bearer.split(" ")[1];
    try {
        const data = await getCurrentUser(token);
        const displayName = data.body.display_name || "Not available";
        const url = data.body.external_urls.spotify;
        const image = data.body.images?.at(0)?.url;
        const user: SpotifyProfile = {
            displayName,
            url,
            image
        };
        return json(user);
    } catch (err) {
        if (
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
        }

        throw error(500, "unknown error");
    }
};
