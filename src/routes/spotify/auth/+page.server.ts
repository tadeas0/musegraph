import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getAuthorizeUrl } from "$lib/server/SpotifyClient";
import { SPOTIFY_REDIRECT_COOKIE } from "$lib/constants";

export const load: PageServerLoad = ({ cookies, url }) => {
    const authUrl = getAuthorizeUrl();

    const customRedirectUrl = url.searchParams.get("redirectUrl") || "/";
    cookies.set(SPOTIFY_REDIRECT_COOKIE, customRedirectUrl, { path: "/" });
    throw redirect(303, authUrl);
};
