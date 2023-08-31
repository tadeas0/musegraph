<script lang="ts">
    import ArtistCard from "$lib/components/ArtistCard.svelte";
    import type { Artist } from "$lib/types/Artist";
    import { stopAudio } from "$lib/stores/AudioStore";
    import { fly } from "svelte/transition";
    import { quartOut } from "svelte/easing";
    import { fetchArtist } from "$lib/api";
    import { artistStack } from "$lib/stores/ArtistStackStore.js";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import { goto } from "$app/navigation";
    import { toast } from "$lib/notification";
    import { currentArtist } from "$lib/stores/CurrentArtistStore";

    let loading = false;

    async function handleArtistClick(artist: Artist) {
        try {
            stopAudio();
            loading = true;
            const data = await fetchArtist(artist.dbpediaUrl, fetch);
            goto(`/artist/${btoa(artist.dbpediaUrl)}`);
            artistStack.add(data);
        } catch (err) {
            console.error(err);
            toast("Could not get artist. Please try again.", "error");
        } finally {
            loading = false;
        }
    }
</script>

{#key $currentArtist}
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
            {#each $currentArtist.similarArtists as a}
                <ArtistCard
                    artist={a}
                    on:clickArtist={(e) => handleArtistClick(e.detail)}
                />
            {/each}
        </div>
    </div>
{/key}
