import { SPOTIFY_REDIRECT_COOKIE } from "$lib/constants";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ cookies }) => {
    const redirectUrl = cookies.get(SPOTIFY_REDIRECT_COOKIE) || "/";
    return { redirectUrl: redirectUrl };
};
