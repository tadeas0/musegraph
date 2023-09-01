import { kv } from "$lib/server/KVClient";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { Session } from "$lib/types/Session";
import type { StackState } from "$lib/stores/ArtistStackStore";

export const GET: RequestHandler = async ({ params }) => {
    const session = await kv.get<Session | null>(params.sessionId);

    if (!session) {
        throw error(404, "session not found");
    }
    return json(session);
};

export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const data = await request.json();
        const stackState: StackState[] = data.artistStack.map((a: any) => ({
            name: a.name,
            dbpediaUrl: a.dbpediaUrl,
            genres: a.genres,
            artist: a.artist,
            similarArtists: a.similarArtists
        }));

        const session: Session = {
            id: params.sessionId,
            artistStack: stackState
        };

        await kv.set(params.sessionId, session);

        return json(session);
    } catch (err) {
        console.error(err);
        throw error(400, "invalid json");
    }
};
