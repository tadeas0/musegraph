<script lang="ts">
    import ArtistCard from "$lib/ArtistCard.svelte";
    import type { Artist } from "$lib/types/Artist";
    import { stopAudio } from "$lib/stores/AudioStore";
    import MdArrowBack from "svelte-icons/md/MdArrowBack.svelte";
    import { fly } from "svelte/transition";
    import { quartOut } from "svelte/easing";
    import { tick } from "svelte";
    import { fetchArtist } from "$lib/api";

    interface StackState {
        artist: Artist;
        similarArtists: Artist[];
    }

    export let data: StackState;
    let stepsStack: StackState[] = [data];
    let transitionDir = 1;

    $: currentStep = stepsStack.at(-1);

    async function handleArtistClick(artist: Artist) {
        stopAudio();
        const data = await fetchArtist(artist.dbpediaUrl, fetch);
        stepsStack = [...stepsStack, data];
    }

    async function handlePreviousClick() {
        transitionDir = -1;
        stepsStack.pop();
        stepsStack = stepsStack;
        stopAudio();
        await tick();
        transitionDir = 1;
    }
</script>

<div class="flex flex-col items-center">
    <div class="mb-6 flex w-full flex-row justify-between">
        <button
            class="flex flex-row items-center underline disabled:text-slate-400 disabled:no-underline"
            disabled={stepsStack.length <= 1}
            on:click={handlePreviousClick}
        >
            <div class="h-4"><MdArrowBack /></div>
            previous
        </button>
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
                <div class="w-full">
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
