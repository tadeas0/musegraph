import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getAuthorizeUrl } from "$lib/server/SpotifyClient";

export const load: PageServerLoad = () => {
    const authUrl = getAuthorizeUrl();

    throw redirect(303, authUrl);
};
