<script lang="ts">
    import { page } from "$app/stores";
    import { artistStack } from "$lib/stores/ArtistStackStore";
</script>

<nav class="flex w-full flex-row justify-between p-4">
    {#if $artistStack.length > 0}
        <a class="underline" href={`/artist/${$page.params.artistId}/graph`}>graph</a>
        <a class="underline" href={`/artist/${$page.params.artistId}`}>list</a>
        <a class="underline" href="/">search</a>
    {/if}
</nav>
