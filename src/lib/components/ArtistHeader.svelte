<script lang="ts">
    import ArtistCard from "./ArtistCard.svelte";
    import type { StackState } from "$lib/stores/SessionStore";
    import { page } from "$app/stores";
    import FaSpotify from "svelte-icons/fa/FaSpotify.svelte";

    export let artistStack: StackState[];

    $: currentArtist = artistStack.at(-1);
    $: discoveredCount = new Set(artistStack.map((a) => a.artist.dbpediaUrl)).size;
</script>

<div class="flex w-full flex-col gap-2">
    <div class="flex w-full items-end">
        <div>
            <span class="badge variant-outline-primary">
                Discovered artists: {discoveredCount}
            </span>
        </div>
        <a
            class="btn variant-ghost-primary ml-auto"
            href={`/session/${$page.params.sessionId}/playlist`}
        >
            <span class="w-6"><FaSpotify /></span>
            <span>Create playlist</span>
        </a>
    </div>
    {#if currentArtist}
        <ArtistCard artist={currentArtist.artist} />
    {/if}
</div>
