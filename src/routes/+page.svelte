<script lang="ts">
    import MdSearch from "svelte-icons/md/MdSearch.svelte";
    import MdArrowForward from "svelte-icons/md/MdArrowForward.svelte";
    import { createSession, fetchArtist } from "$lib/api";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import { toast } from "$lib/notification";
    import { goto } from "$app/navigation";
    import SpotifyProfile from "$lib/components/SpotifyProfile.svelte";
    import { spotifyUserStore } from "$lib/stores/SpotifyProfileStore";
    import type { ActionData } from "./$types";
    import { enhance } from "$app/forms";
    import SpotifyLoginButton from "$lib/components/SpotifyLoginButton.svelte";
    import { getToastStore } from "@skeletonlabs/skeleton";

    export let form: ActionData;

    let loading = false;
    const toastStore = getToastStore();

    async function handleNavigate(dbpediaUrl: string) {
        try {
            loading = true;
            const data = await fetchArtist(dbpediaUrl, fetch);
            const stack = [data];
            const session = await createSession(stack);
            goto(`/session/${session.id}/discover/graph`);
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: "Could not get artist.",
                background: "variant-filled-error"
            });
        } finally {
            loading = false;
        }
    }
</script>

<div class="relative flex flex-col items-center p-2">
    <a href="/" class="gradient-heading h1 mb-8 font-bold">MuseGraph</a>
    {#if loading}
        <div class="fixed bottom-0 left-0 right-0 top-0 z-20">
            <LoadingOverlay />
        </div>
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
                <SpotifyLoginButton text="Log in with spotify" />
            </div>
        {/if}
    </div>
    <div class="mt-20">
        <form
            class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
            method="POST"
            use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    loading = false;
                    await update();
                };
            }}
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
        {#if form?.error}
            <aside class="variant-ghost-error alert mt-4">{form?.error}</aside>
        {/if}
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
