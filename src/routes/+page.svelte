<script lang="ts">
    import MdSearch from "svelte-icons/md/MdSearch.svelte";
    import MdArrowForward from "svelte-icons/md/MdArrowForward.svelte";
    import { createSession, fetchArtist, fetchArtistsByName } from "$lib/api";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import { toast } from "$lib/notification";
    import FaSpotify from "svelte-icons/fa/FaSpotify.svelte";
    import { goto } from "$app/navigation";
    import SpotifyProfile from "$lib/components/SpotifyProfile.svelte";
    import { spotifyUserStore } from "$lib/stores/SpotifyProfileStore";
    import type { ActionData } from "./$types";
    import { enhance } from "$app/forms";

    export let form: ActionData;

    let gettingArtist = false;

    async function handleNavigate(dbpediaUrl: string) {
        try {
            gettingArtist = true;
            const data = await fetchArtist(dbpediaUrl, fetch);
            const stack = [data];
            const session = await createSession(stack);
            goto(`/session/${session.id}/discover/graph`);
        } catch (err) {
            console.error(err);
            toast("Could not get artist.", "error");
        } finally {
            gettingArtist = false;
        }
    }
</script>

<div class="relative flex flex-col items-center p-2">
    <a href="/" class="gradient-heading h1 mb-8 font-bold">MuseGraph</a>
    {#if gettingArtist}
        <LoadingOverlay />
    {/if}
    <div class="h-16">
        {#if $spotifyUserStore}
            <SpotifyProfile
                on:logout={() => ($spotifyUserStore = null)}
                profile={$spotifyUserStore}
            />
        {:else}
            <div class="card flex flex-col items-center gap-4 p-4">
                <p>In order to create playlists, you need to log in with spotify.</p>
                <a href="/spotify/auth" class="btn variant-filled-primary">
                    <span class="w-4"><FaSpotify /></span>
                    <span>Log in with spotify</span>
                </a>
            </div>
        {/if}
    </div>
    <div class="mt-20">
        <form
            class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
            method="POST"
            use:enhance
        >
            <div class="input-group-shim"><span class="w-6"><MdSearch /></span></div>
            <input
                type="search"
                id="query"
                name="query"
                class={form?.error && "input-error"}
                placeholder="Search..."
            />
            <button class="variant-filled-secondary">Submit</button>
        </form>
        {#if form?.artists?.length}
            <div class="card mt-4 p-1">
                <nav class="list-nav">
                    <ul>
                        {#each form.artists as a}
                            <li>
                                <button
                                    class="btn flex w-full justify-start"
                                    on:click={() => handleNavigate(a.dbpediaUrl)}
                                >
                                    <span class="badge w-8 bg-primary-500">
                                        <MdArrowForward />
                                    </span>
                                    <span>{a.name}</span>
                                </button>
                            </li>
                        {/each}
                    </ul>
                </nav>
            </div>
        {/if}
    </div>
</div>
