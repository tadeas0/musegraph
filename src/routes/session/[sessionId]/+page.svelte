<script lang="ts">
    import ArtistCard from "$lib/components/ArtistCard.svelte";
    import type { Artist } from "$lib/types/Artist";
    import { stopAudio } from "$lib/stores/AudioStore";
    import { fly } from "svelte/transition";
    import { quartOut } from "svelte/easing";
    import { fetchArtist } from "$lib/api";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import { toast } from "$lib/notification";
    import { getContext } from "svelte";
    import type { SessionStore } from "$lib/stores/SessionStore";
    import { SESSION_CONTEXT_KEY } from "$lib/constants";

    let loading = false;

    const sessionStore: SessionStore = getContext(SESSION_CONTEXT_KEY);

    async function handleArtistClick(artist: Artist) {
        try {
            stopAudio();
            loading = true;
            const data = await fetchArtist(artist.dbpediaUrl, fetch);
            await sessionStore.add(data);
        } catch (err) {
            console.error(err);
            toast("Could not get artist. Please try again.", "error");
        } finally {
            loading = false;
        }
    }

    $: currentArtist = $sessionStore.at(-1);
</script>

{#key currentArtist}
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
            <h1 class="mb-4 mt-8 text-2xl">Similar artists</h1>
            <div class="relative">
                {#if loading}
                    <LoadingOverlay spinnerPosition="top" />
                {/if}
                {#each currentArtist?.similarArtists || [] as a}
                    <ArtistCard
                        artist={a}
                        on:clickArtist={(e) => handleArtistClick(e.detail)}
                    />
                {/each}
            </div>
        </div>
    </div>
{/key}
