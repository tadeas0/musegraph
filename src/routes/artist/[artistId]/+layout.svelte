<script lang="ts">
    import { ARTIST_STACK_KEY } from "$lib/constants";
    import { createArtistStack } from "$lib/stores/ArtistStackStore";
    import { setContext, tick } from "svelte";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
    import { page } from "$app/stores";
    import MdArrowBack from "svelte-icons/md/MdArrowBack.svelte";
    import { stopAudio } from "$lib/stores/AudioStore";
    import ArtistCard from "$lib/components/ArtistCard.svelte";

    export let data: LayoutData;

    const artistStackStore = createArtistStack();

    setContext(ARTIST_STACK_KEY, artistStackStore);

    onMount(() => {
        artistStackStore.clear();
        artistStackStore.add(data);
    });

    async function handlePreviousClick() {
        stopAudio();
        artistStackStore.popLast();
        await tick();
    }

    $: currentStep = $artistStackStore.at(-1);
</script>

<div class="flex flex-col items-center">
    <div class="mb-6 flex w-full flex-row justify-between">
        <button
            class="flex flex-row items-center underline disabled:text-slate-400 disabled:no-underline"
            disabled={$artistStackStore.length <= 1}
            on:click={handlePreviousClick}
        >
            <div class="h-4"><MdArrowBack /></div>
            previous
        </button>
        <a class="underline" href={`/artist/${$page.params.artistId}/graph`}>graph</a>
        <a class="underline" href={`/artist/${$page.params.artistId}`}>list</a>
        <a class="underline" href="/">search</a>
    </div>
    {#if currentStep?.artist}
        <div class="mb-2 w-full border-b-2 lg:w-4/6">
            <ArtistCard artist={currentStep.artist} />
        </div>
    {/if}
    <slot />
</div>
