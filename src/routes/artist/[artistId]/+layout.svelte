<script lang="ts">
    import { tick } from "svelte";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
    import { page } from "$app/stores";
    import MdArrowBack from "svelte-icons/md/MdArrowBack.svelte";
    import { stopAudio } from "$lib/stores/AudioStore";
    import ArtistCard from "$lib/components/ArtistCard.svelte";
    import { artistStack } from "$lib/stores/ArtistStackStore";

    export let data: LayoutData;

    onMount(() => {
        artistStack.clear();
        artistStack.add(data);
    });

    async function handlePreviousClick() {
        stopAudio();
        artistStack.popLast();
        await tick();
    }

    $: currentStep = $artistStack.at(-1);
    $: discoveredCount = new Set($artistStack.map((a) => a.artist.dbpediaUrl)).size;
</script>

<div class="flex flex-col items-center">
    <div class="mb-6 flex w-full flex-row justify-between">
        <button
            class="flex flex-row items-center underline disabled:text-slate-400 disabled:no-underline"
            disabled={$artistStack.length <= 1}
            on:click={handlePreviousClick}
        >
            <div class="h-4"><MdArrowBack /></div>
            previous
        </button>
        <a class="underline" href={`/artist/${$page.params.artistId}/graph`}>graph</a>
        <a class="underline" href={`/artist/${$page.params.artistId}`}>list</a>
        <a class="underline" href="/">search</a>
    </div>
    <div class="mb-2 flex w-full border-b-2 text-sm">
        <div class="text-sm text-gray-700">
            Discovered artists: {discoveredCount}
        </div>
        <a class="ml-auto underline" href="/playlist">Create playlist</a>
    </div>
    {#if currentStep?.artist}
        <div class="mb-2 w-full border-b-2 lg:w-4/6">
            <ArtistCard artist={currentStep.artist} />
        </div>
    {/if}
    <slot />
</div>
