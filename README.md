# MuseGraph
> [!WARNING]
> Playlist creation is currently enabled only for a handful of Spotify accounts, that are part of beta testing

**Visit https://musegraph.vercel.app, to see a live version of the app**

## What is it?

MuseGraph is a music recommendation and visualization system. It allows you to discover artists, visualize their connections to other interprets and create playlists based on those connections.

## How does it work?

The recommendations are based on data extracted from [DBPedia](https://www.dbpedia.org/) using SPARQL queries. The song previews and playlist creation make use of [Spotify](https://www.spotify.com/) web API.

## How to run it?

MuseGraph requires a [Vercel KV storage](https://vercel.com/docs/storage/vercel-kv) instance to store session data. In order to run MuseGraph yourself, you need to create a `.env` file in the root of this repository, that contains following information (replace parts marked with `${}` with your own data):

```
SPOTIFY_CLIENT_ID=${Your Spotify API Client ID}
SPOTIFY_CLIENT_SECRET=${Your Spotify API Client secret}
KV_REST_API_URL=${Your Vercel KV REST API URL}
KV_REST_API_TOKEN=${Your Vercel KV REST API token}
SPOTIFY_REDIRECT_URI=http://${yourappurl}/spotify/redirect"
```

After creating the `.env` file, you can run MuseGraph in development mode using this command:
```
npm run dev
```