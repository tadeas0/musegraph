import type { Artist } from "./types/Artist";
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
