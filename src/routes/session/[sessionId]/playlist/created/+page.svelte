<script lang="ts">
    import type { SpotifyPlaylist } from "$lib/types/SpotifyPlaylist";
    import { page } from "$app/stores";
    import FaSpotify from "svelte-icons/fa/FaSpotify.svelte";

    export let data: SpotifyPlaylist;
</script>

<div class="flex w-full flex-col items-center">
    <h1 class="h1 mt-4">
        Created playlist <span class="font-bold">{data.name}</span>
    </h1>
    <a target="_blank" href={data.url} class="btn variant-filled-primary mt-8">
        <span class="w-6"><FaSpotify /></span>
        <span>Show on spotify</span>
    </a>
    <a
        href={`/session/${$page.params.sessionId}/discover/graph`}
        class="btn variant-filled-error mt-6"
    >
        Back to graph
    </a>
</div>
