<script lang="ts">
    import ArtistCard from "./ArtistCard.svelte";
    import type { StackState } from "$lib/stores/SessionStore";
    import { page } from "$app/stores";
    import FaSpotify from "svelte-icons/fa/FaSpotify.svelte";
    import { spotifyUserStore } from "$lib/stores/SpotifyProfileStore";
    import SpotifyLoginButton from "./SpotifyLoginButton.svelte";

    export let artistStack: StackState[];

    $: currentArtist = artistStack.at(-1);
    $: discoveredCount = new Set(artistStack.map((a) => a.artist.dbpediaUrl)).size;
    $: isLoggedIn = $spotifyUserStore !== null;
</script>

<div class="flex w-full flex-col gap-2">
    <div class="flex w-full items-end">
        <div>
            <span class="badge variant-outline-primary">
                Discovered artists: {discoveredCount}
            </span>
        </div>
        {#if isLoggedIn}
            <a
                class="btn variant-ghost-primary ml-auto"
                href={`/session/${$page.params.sessionId}/playlist`}
            >
                <span class="w-6"><FaSpotify /></span>
                <span>Create playlist</span>
            </a>
        {:else}
            <SpotifyLoginButton classes="ml-auto" redirectUrl={$page.url.toString()} />
        {/if}
    </div>
    {#if currentArtist}
        <ArtistCard artist={currentArtist.artist} />
    {/if}
</div>
