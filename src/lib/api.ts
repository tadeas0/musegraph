import type { StackState } from "./stores/SessionStore";
import type { Artist } from "./types/Artist";
import type { Session } from "./types/Session";
import type { SpotifyData } from "./types/SpotifyData";
import type { SpotifyPlaylist } from "./types/SpotifyPlaylist";
import type { SpotifyProfile } from "./types/SpotifyProfile";
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
    const res = await f(`/api/artist/${encodeURIComponent(artistUrl)}`);
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

export async function fetchCurrentSpotifyUser(
    bearer: string,
    svelteFetch: SvelteFetch | undefined = undefined
): Promise<SpotifyProfile> {
    const f = getFetchFn(svelteFetch);
    const res = await f("/api/spotify/me", { headers: { Authorization: bearer } });
    if (!res.ok) {
        throw new Error("Could not get current Spotify user");
    }
    const data = await res.json();
    return data;
}

export async function createPlaylist(
    playlistName: string,
    artists: string[],
    bearer: string,
    svelteFetch: SvelteFetch | undefined = undefined
): Promise<SpotifyPlaylist> {
    const f = getFetchFn(svelteFetch);
    const res = await f("/api/spotify/playlist", {
        headers: { Authorization: bearer },
        body: JSON.stringify({ name: playlistName, artists }),
        method: "POST"
    });

    if (!res.ok && res.status === 403) {
        throw new Error("User is not part of beta testing. Could not create playlist.");
    } else if (!res.ok) {
        throw new Error("Could not create playlist.");
    }

    return await res.json();
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
