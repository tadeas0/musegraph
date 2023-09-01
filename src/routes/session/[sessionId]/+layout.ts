import { getSession } from "$lib/api";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, params }) => {
    const session = await getSession(params.sessionId, fetch);
    return session;
};
