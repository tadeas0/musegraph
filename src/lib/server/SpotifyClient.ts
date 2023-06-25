import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";
import { randInt } from "$lib/common";
import type { Song } from "$lib/types/Song";
import type { SpotifyData } from "$lib/types/SpotifyData";
import SpotifyWebApi from "spotify-web-api-node";

export async function getSpotifyData(artist: string): Promise<SpotifyData | null> {
    const spotify = new SpotifyWebApi({
        clientId: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET
    });
    const authRes = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(authRes.body["access_token"]);
    const artistRes = await spotify.searchArtists(artist);
    const spotArtist = artistRes.body.artists?.items[0];
    if (!spotArtist) {
        return null;
    }
    const trackRes = await spotify.getArtistTopTracks(spotArtist.id, "GB");
    const topTracks = trackRes.body.tracks;

    // Filter out tracks without previews
    const target = topTracks.filter((t) => t.preview_url !== null);
    let song: Song | undefined = undefined;
    if (target.length > 0) {
        const t = target[randInt(0, target.length)];
        song = {
            name: t.name,
            previewUrl: t.preview_url as string,
            spotifyUrl: t.uri
        };
    }

    return {
        artistUrl: spotArtist.external_urls.spotify,
        image: spotArtist.images.at(-1)?.url,
        song: song
    };
}
