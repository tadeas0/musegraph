<script lang="ts">
    import ArtistCard from "$lib/components/ArtistCard.svelte";
    import type { Artist } from "$lib/types/Artist";
    import { stopAudio } from "$lib/stores/AudioStore";
    import { fly } from "svelte/transition";
    import { quartOut } from "svelte/easing";
    import { fetchArtist } from "$lib/api";
    import { getContext } from "svelte";
    import { ARTIST_STACK_KEY } from "$lib/constants.js";
    import type { ArtistStackStore } from "$lib/stores/ArtistStackStore.js";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";

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
</script>

{#if currentStep}
    {#key currentStep}
        <div
            class="w-full lg:w-4/6"
            in:fly={{
                x: 15,
                duration: 100,
                delay: 100,
                easing: quartOut
            }}
            out:fly|local={{
                x: -50,
                duration: 100,
                easing: quartOut
            }}
        >
            <div class="relative w-full">
                {#if loading}
                    <LoadingOverlay />
                {/if}
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
