<script>
    import { artistStack } from "$lib/stores/ArtistStackStore";
    import { currentArtist } from "$lib/stores/CurrentArtistStore";
    import ArtistCard from "./ArtistCard.svelte";

    $: discoveredCount = new Set($artistStack.map((a) => a.artist.dbpediaUrl)).size;
</script>

<div class="flex w-full flex-col lg:w-2/3">
    <div class="flex w-full py-1 text-sm">
        <div class="text-sm text-gray-700">
            Discovered artists: {discoveredCount}
        </div>
        <a class="ml-auto underline" href="/playlist">Create playlist</a>
    </div>
    <div class="border-y-2 py-1">
        <ArtistCard artist={$currentArtist.artist} />
    </div>
</div>
