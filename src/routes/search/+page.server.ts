import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { getArtistsByName } from "$lib/DBPediaClient";

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const query = data.get("query");
        if (!query) {
            return fail(400, { error: "Missing query" });
        }

        const artists = await getArtistsByName(query.toString());
        if (artists.length <= 0) {
            return fail(404, { error: "Did not find any artists with such name" });
        }

        return { artists };
    }
};
