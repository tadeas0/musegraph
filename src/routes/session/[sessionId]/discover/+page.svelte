<script lang="ts">
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
    import { Avatar } from "@skeletonlabs/skeleton";

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
        class="w-full"
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
                <nav class="list-nav">
                    <dl class="list-dl">
                        {#each currentArtist?.similarArtists || [] as a}
                            <button
                                on:click={() => handleArtistClick(a)}
                                class="btn flex w-full justify-start"
                            >
                                <span>
                                    <Avatar
                                        width="w-10"
                                        initials={a.name.replace(" ", "").slice(0, 2)}
                                    />
                                </span>
                                <span class="flex flex-col items-start">
                                    <dt>{a.name}</dt>
                                    <dd class="text-sm text-tertiary-600">
                                        {a.genres.slice(0, 2).join(", ")}
                                    </dd>
                                </span>
                            </button>
                        {/each}
                    </dl>
                </nav>
            </div>
        </div>
    </div>
{/key}
