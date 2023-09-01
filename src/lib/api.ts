import type { StackState } from "./stores/SessionStore";
import type { Artist } from "./types/Artist";
import type { Session } from "./types/Session";
import type { SpotifyData } from "./types/SpotifyData";
import type SvelteFetch from "./types/SvelteFetch";

function getFetchFn(svelteFetch: SvelteFetch | undefined) {
    if (svelteFetch) return svelteFetch;
    return fetch;
}

export async function fetchArtist(
    artistUrl: string,
    svelteFetch: SvelteFetch | undefined = undefined
): Promise<{ artist: Artist; similarArtists: Artist[] }> {
    const f = getFetchFn(svelteFetch);
    const res = await f(`/api/artist/${btoa(artistUrl)}`);
    if (!res.ok) {
        throw new Error("Could not fetch artist");
    }
    const data = await res.json();
    return data;
}

export async function fetchSpotifyData(
    artistName: string,
    svelteFetch: SvelteFetch | undefined = undefined
): Promise<SpotifyData> {
    const f = getFetchFn(svelteFetch);
    const res = await f(`/api/spotify?${new URLSearchParams({ artist: artistName })}`);
    if (!res.ok) {
        throw new Error("Could not fetch song");
    }
    const data = await res.json();
    return data;
}

export async function fetchArtistsByName(
    artistName: string,
    svelteFetch: SvelteFetch | undefined = undefined
): Promise<{ artists: Artist[] }> {
    const f = getFetchFn(svelteFetch);
    const res = await f(`/api/artist?${new URLSearchParams({ name: artistName })}`);
    if (!res.ok) {
        throw new Error("Could not fetch artists");
    }
    const data = await res.json();
    return data;
}

export async function createSession(
    artistStack: StackState[],
    svelteFetch: SvelteFetch | undefined = undefined
): Promise<Session> {
    const f = getFetchFn(svelteFetch);
    const res = await f("/api/session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ artistStack })
    });
    if (!res.ok) {
        throw new Error("Could not create session");
    }

    const data = await res.json();
    return data;
}

export async function getSession(
    sessionId: string,
    svelteFetch: SvelteFetch | undefined = undefined
): Promise<Session> {
    const f = getFetchFn(svelteFetch);
    const res = await f(`/api/session/${sessionId}`);

    if (!res.ok && res.status === 404) {
        throw new Error("Session with this id not found");
    } else if (!res.ok) {
        throw new Error("Could not get session");
    }

    return await res.json();
}

export async function updateSession(
    sessionId: string,
    artistStack: StackState[],
    svelteFetch: SvelteFetch | undefined = undefined
): Promise<Session> {
    const f = getFetchFn(svelteFetch);
    const res = await f(`/api/session/${sessionId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ artistStack })
    });
    if (!res.ok) {
        throw new Error("Could not create session");
    }

    const data = await res.json();
    return data;
}
