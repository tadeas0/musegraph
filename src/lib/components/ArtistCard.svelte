<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Artist } from "../types/Artist";
    import MdPlayArrow from "svelte-icons/md/MdPlayArrow.svelte";
    import MdPause from "svelte-icons/md/MdPause.svelte";
    import { playingAudio } from "../stores/AudioStore";
    import FaSpotify from "svelte-icons/fa/FaSpotify.svelte";
    import { fetchSpotifyData } from "../api";
    import type { SpotifyData } from "../types/SpotifyData";
    import { goto } from "$app/navigation";
    import Spinner from "./Spinner.svelte";

    export let artist: Artist;

    let loading: boolean = false;
    let canPlay: boolean = true;
    let spotifyData: SpotifyData | null = null;
    let audio: HTMLAudioElement | null = null;
    const maxGenresDisplay = 3;
    const imagePlaceholder =
        "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png";
    $: displayGenres = artist.genres.slice(0, maxGenresDisplay).join(", ");
    $: playing = $playingAudio && $playingAudio === audio;
    $: {
        loading = true;
        fetchSpotifyData(artist.name, fetch)
            .then((data) => (spotifyData = data))
            .catch((e) => {
                canPlay = false;
                spotifyData = null;
            })
            .finally(() => (loading = false));
    }

    const dispatch = createEventDispatcher();

    async function playPreview() {
        if (!canPlay) return;

        $playingAudio?.pause();
        if ($playingAudio && $playingAudio === audio) {
            $playingAudio = null;
            return;
        }

        if (!audio && spotifyData?.song) {
            audio = new Audio(spotifyData.song.previewUrl);
            $playingAudio = audio;
            audio.play();
        }
    }
</script>

<div class="hover:bg-slate-200 lg:px-3">
    <div class="flex h-16 w-full items-center justify-start gap-6">
        <div class="relative flex h-14 w-14 justify-center">
            <button
                disabled={spotifyData === null}
                on:click={() => {
                    if (spotifyData) {
                        goto(spotifyData.artistUrl);
                    }
                }}
            >
                <img
                    class="block h-auto w-full rounded-md"
                    src={spotifyData?.image || imagePlaceholder}
                    alt="artist"
                />
            </button>
            {#if loading}
                <div
                    class="absolute left-0 top-0 flex h-full w-full justify-center rounded-md bg-white bg-opacity-80"
                >
                    <Spinner />
                </div>
            {/if}
        </div>
        <button
            class="w-full overflow-hidden py-3 text-left"
            on:click={() => dispatch("clickArtist", artist)}
        >
            <div class="text-md overflow-ellipsis whitespace-nowrap">
                {artist.name}
            </div>
            <div class="mt-1 text-xs text-slate-600">{displayGenres}</div>
        </button>
        <button
            disabled={!canPlay || spotifyData?.song === undefined}
            class="col-span-1 w-10 rounded-md bg-blue-400 p-1 text-white shadow-md shadow-slate-500 outline-none disabled:bg-gray-400 disabled:shadow-none"
            on:click={playPreview}
        >
            {#if playing}
                <MdPause />
            {:else}
                <MdPlayArrow />
            {/if}
        </button>
        <a
            class="w-10 rounded-md bg-blue-400 p-1.5 text-white shadow-md shadow-slate-500"
            class:bg-gray-400={!loading && spotifyData === null}
            class:shadow-none={!loading && spotifyData === null}
            href={spotifyData?.artistUrl}
            target="_blank"
        >
            <FaSpotify />
        </a>
    </div>
</div>