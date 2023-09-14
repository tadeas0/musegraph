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
    import { Avatar } from "@skeletonlabs/skeleton";
    import { PLACEHOLDER_AVATAR_URL } from "$lib/constants";

    export let artist: Artist;

    let loading: boolean = false;
    let canPlay: boolean = true;
    let spotifyData: SpotifyData | null = null;
    let audio: HTMLAudioElement | null = null;
    $: playing = $playingAudio && $playingAudio === audio;
    $: {
        loading = true;
        fetchSpotifyData(artist.name, fetch)
            .then((data) => (spotifyData = data))
            .catch((e) => {
                spotifyData = null;
            })
            .finally(() => (loading = false));
    }

    const dispatch = createEventDispatcher();

    async function playPreview() {
        $playingAudio?.pause();
        if ($playingAudio && $playingAudio === audio) {
            $playingAudio = null;
            return;
        }

        if (spotifyData?.song) {
            audio = new Audio(spotifyData.song.previewUrl);
            $playingAudio = audio;
            audio.play();
        }
    }
</script>

<div class="card variant-filled-surface p-4 md:max-w-md">
    <Avatar
        rounded="rounded-md"
        width="w-24"
        src={spotifyData?.image || PLACEHOLDER_AVATAR_URL}
    />
    <div class="flex items-center gap-4">
        <h3 class="h3 font-semibold">{artist.name}</h3>
        <button
            disabled={!canPlay || spotifyData?.song === undefined}
            on:click={playPreview}
            class="btn btn-icon variant-filled-tertiary ml-auto p-2"
        >
            {#if playing}
                <MdPause />
            {:else}
                <MdPlayArrow />
            {/if}
        </button>
        <button
            disabled={spotifyData === null}
            on:click={() => {
                if (spotifyData) {
                    goto(spotifyData.artistUrl);
                }
            }}
            class="btn btn-icon variant-filled-primary p-2"
        >
            <FaSpotify />
        </button>
    </div>
</div>
