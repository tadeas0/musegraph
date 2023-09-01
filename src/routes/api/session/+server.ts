import type { RequestHandler } from "./$types";
import { error, json } from "@sveltejs/kit";
import type { StackState } from "$lib/stores/ArtistStackStore";
import type { Session } from "$lib/types/Session";
import { kv } from "$lib/server/KVClient";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const sessionId = crypto.randomUUID();

        const stackState: StackState[] = data.artistStack.map((a: any) => ({
            name: a.name,
            dbpediaUrl: a.dbpediaUrl,
            genres: a.genres,
            artist: a.artist,
            similarArtists: a.similarArtists
        }));

        const session: Session = {
            id: sessionId,
            artistStack: stackState
        };

        await kv.set(sessionId, session);

        return json(session);
    } catch (err) {
        console.error(err);
        throw error(400, "invalid json");
    }
};
