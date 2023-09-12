<script lang="ts">
    import ArtistCard from "./ArtistCard.svelte";
    import type { StackState } from "$lib/stores/SessionStore";
    import { page } from "$app/stores";

    export let artistStack: StackState[];

    $: currentArtist = artistStack.at(-1);
    $: discoveredCount = new Set(artistStack.map((a) => a.artist.dbpediaUrl)).size;
</script>

<div class="flex w-full flex-col lg:w-2/3">
    <div class="flex w-full py-1 text-sm">
        <div class="text-sm text-gray-700">
            Discovered artists: {discoveredCount}
        </div>
        <a class="ml-auto underline" href={`/session/${$page.params.sessionId}/playlist`}>
            Create playlist
        </a>
    </div>
    <div class="border-y-2 py-1">
        {#if currentArtist}
            <ArtistCard artist={currentArtist.artist} />
        {/if}
    </div>
</div>
