import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
    const playlistUrl = url.searchParams.get("url");
    const name = url.searchParams.get("name");

    if (!playlistUrl || !name) {
        throw error(404, "playlist not found");
    }

    return { url: playlistUrl, name };
};
