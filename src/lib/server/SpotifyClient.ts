import {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI
} from "$env/static/private";
import { randInt, randomString } from "$lib/common";
import type { Song } from "$lib/types/Song";
import type { SpotifyData } from "$lib/types/SpotifyData";
import type { SpotifyPlaylist } from "$lib/types/SpotifyPlaylist";
import SpotifyWebApi from "spotify-web-api-node";

async function getSpotifyClient(): Promise<SpotifyWebApi> {
    const spotify = new SpotifyWebApi({
        clientId: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET
    });
    const authRes = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(authRes.body["access_token"]);
    return spotify;
}

export async function getSpotifyData(artist: string): Promise<SpotifyData | null> {
    const spotify = await getSpotifyClient();
    const artistRes = await spotify.searchArtists(`artist:${artist}`, {
        market: "GB",
        limit: 50
    });
    if (!artistRes.body.artists?.items[0]) {
        return null;
    }

    const items = artistRes.body.artists?.items;
    items?.sort((i1, i2) => i2.followers.total - i1.followers.total);

    // Pick artist, that matches query exactly
    const spotArtist = artistRes.body.artists?.items.find(
        (i) => i.name.toLowerCase() === artist.toLowerCase()
    );
    if (spotArtist === undefined) {
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

export async function createPlaylist(
    playlistName: string,
    artistNames: string[],
    spotifyToken: string
): Promise<SpotifyPlaylist> {
    const spotify = new SpotifyWebApi({
        clientId: SPOTIFY_CLIENT_ID,
        redirectUri: SPOTIFY_REDIRECT_URI,
        accessToken: spotifyToken
    });
    const searchProm = artistNames.map((a) =>
        spotify.searchArtists(`artist:${a}`, { market: "GB", limit: 50 })
    );
    const searchRes = await Promise.all(searchProm);

    const mappedRes = searchRes.map((sr, i) => {
        const query = artistNames[i];
        const spotArtist = sr.body.artists?.items.find(
            (i) => i.name.toLowerCase() === query.toLowerCase()
        );
        return spotArtist;
    });
    mappedRes.sort((a1, a2) => (a2?.followers.total || 0) - (a1?.followers.total || 0));
    const filteredRes = mappedRes.filter(
        (s) => s !== undefined
    ) as SpotifyApi.ArtistObjectFull[];

    const topTracks = filteredRes.map((fr) => spotify.getArtistTopTracks(fr.id, "GB"));
    const tracksRes = await Promise.all(topTracks);
    const trackIds = tracksRes
        .map((tr) => tr.body.tracks)
        .flat()
        .map((t) => t.uri);
    const playlist = await spotify.createPlaylist(playlistName, {
        collaborative: false,
        public: false
    });
    await spotify.addTracksToPlaylist(playlist.body.id, trackIds);
    return {
        name: playlist.body.name,
        url: playlist.body.external_urls.spotify
    };
}

export function getAuthorizeUrl() {
    const redirectUri = SPOTIFY_REDIRECT_URI;
    const state = randomString(16);
    const scope =
        "user-read-private user-read-email playlist-modify-public playlist-modify-private";

    const params = new URLSearchParams({
        response_type: "token",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    });
    const url = "https://accounts.spotify.com/authorize?" + params;
    return url;
}

export async function getCurrentUser(spotifyToken: string) {
    const spotifyApi = new SpotifyWebApi({
        clientId: SPOTIFY_CLIENT_ID,
        redirectUri: SPOTIFY_REDIRECT_URI,
        accessToken: spotifyToken
    });

    return spotifyApi.getMe();
}
