<script lang="ts">
    import ArtistCard from "$lib/ArtistCard.svelte";
    import type { Artist } from "$lib/types/Artist";
    import { stopAudio } from "$lib/stores/AudioStore";
    import MdArrowBack from "svelte-icons/md/MdArrowBack.svelte";
    import { fly } from "svelte/transition";
    import { quartOut } from "svelte/easing";
    import { tick } from "svelte";
    import { fetchArtist } from "$lib/api";
    import { getContext } from "svelte";
    import { ARTIST_STACK_KEY } from "$lib/constants.js";
    import type { ArtistStackStore } from "$lib/stores/ArtistStackStore.js";
    import { page } from "$app/stores";
    import Spinner from "$lib/Spinner.svelte";

    let transitionDir = 1;
    let loading = false;
    const artistStackStore = getContext<ArtistStackStore>(ARTIST_STACK_KEY);

    $: currentStep = $artistStackStore.at(-1);

    async function handleArtistClick(artist: Artist) {
        stopAudio();
        loading = true;
        const data = await fetchArtist(artist.dbpediaUrl, fetch);
        artistStackStore.add(data);
        loading = false;
    }

    async function handlePreviousClick() {
        transitionDir = -1;
        stopAudio();
        artistStackStore.popLast();
        await tick();
        transitionDir = 1;
    }
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
        <a class="underline" href="/">back to search</a>
    </div>
    {#if currentStep}
        {#key currentStep}
            <div
                class="w-full lg:w-4/6"
                in:fly={{
                    x: transitionDir * 15,
                    duration: 100,
                    delay: 100,
                    easing: quartOut
                }}
                out:fly|local={{
                    x: transitionDir * -50,
                    duration: 100,
                    easing: quartOut
                }}
            >
                <div class="relative w-full">
                    {#if loading}
                        <div
                            role="status"
                            class="absolute flex h-full w-full justify-center bg-white bg-opacity-70"
                        >
                            <div class="mt-64 h-20 w-20">
                                <Spinner />
                            </div>
                        </div>
                    {/if}
                    <ArtistCard artist={currentStep.artist} />
                    <h1 class="mb-4 mt-8 text-2xl">Similar artists</h1>
                    {#each currentStep.similarArtists as a}
                        <ArtistCard
                            artist={a}
                            on:clickArtist={(e) => handleArtistClick(e.detail)}
                        />
                    {/each}
                </div>
            </div>
        {/key}
    {/if}
</div>
