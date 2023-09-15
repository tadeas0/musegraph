<script lang="ts">
    import { SESSION_CONTEXT_KEY } from "$lib/constants";
    import type { ArtistSimilar } from "$lib/types/ArtistSimilar";
    import { getContext } from "svelte";
    import type { SessionStore } from "$lib/stores/SessionStore";
    import { createPlaylist } from "$lib/api";
    import { goto } from "$app/navigation";
    import { spotifyUserStore } from "$lib/stores/SpotifyProfileStore";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import FaSpotify from "svelte-icons/fa/FaSpotify.svelte";

    const sessionStore: SessionStore = getContext(SESSION_CONTEXT_KEY);
    let selectedArtists: string[] = [];
    let loading = false;
    let error: string | null = null;

    function filterDuplicateArtists(artistStack: ArtistSimilar[]) {
        return artistStack.filter(
            (v, i, a) => a.findIndex((v2) => v2.artist.name === v.artist.name) === i
        );
    }

    function handleSelectAll() {
        if (areAllSelected) {
            selectedArtists = [];
        } else {
            selectedArtists = artistList.map((a) => a.artist.name);
        }
    }

    async function handleSubmit(event: SubmitEvent) {
        loading = true;
        try {
            const formData = new FormData(event.target as HTMLFormElement);
            const artists = formData.getAll("artists").map((d) => d.toString());
            const name = formData.get("name");
            if (name === null || name.toString() === "") {
                error = "Missing playlist name";
            } else if (artists.length === 0) {
                error = "No artists selected";
            } else if ($spotifyUserStore) {
                const playlist = await createPlaylist(
                    name.toString(),
                    artists,
                    $spotifyUserStore.token.token
                );
                goto(`./playlist/created?${new URLSearchParams({ ...playlist })}`);
            } else {
                error = "User not logged in";
            }
        } catch (err) {
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = "Something went wrong";
                console.error(err);
            }
        } finally {
            loading = false;
        }
    }

    $: artistList = filterDuplicateArtists($sessionStore);
    $: areAllSelected =
        selectedArtists.length === artistList.length && artistList.length > 0;
</script>

<form
    class="mt-4 flex flex-col items-start gap-8"
    on:submit|preventDefault={handleSubmit}
>
    <div class="w-full">
        {#if error}
            <aside class="variant-ghost-error alert">
                {error}
            </aside>
        {/if}
    </div>
    {#if loading}
        <div class="fixed bottom-0 left-0 right-0 top-0 z-20">
            <LoadingOverlay />
        </div>
    {/if}
    <button class="btn variant-filled-primary self-end">
        <span class="w-6"><FaSpotify /></span>
        <span>Create playlist</span>
    </button>
    <label class="label">
        <span>Playlist name</span>
        <input
            class="input"
            title="Playlist name"
            type="text"
            name="name"
            placeholder="My playlist name"
        />
    </label>
    <div class="flex items-start space-x-2">
        <input
            class="checkbox"
            type="checkbox"
            checked={areAllSelected}
            id="selectAll"
            on:click={handleSelectAll}
        />
        <div class="grid gap-1.5 leading-none">
            <label for="selectAll" class="text-xl font-medium leading-none">
                Select all
            </label>
            <p class="text-sm">{selectedArtists.length} selected</p>
        </div>
    </div>
    <div class="space-y-2 pl-8">
        {#each artistList as a}
            <div class="items-top flex space-x-2">
                <input
                    class="checkbox"
                    type="checkbox"
                    name="artists"
                    id={a.artist.name}
                    value={a.artist.name}
                    bind:group={selectedArtists}
                />
                <div class="grid gap-1.5 leading-none">
                    <label class="label" for={a.artist.name}>
                        {a.artist.name}
                    </label>
                    <p class="text-sm text-tertiary-500">
                        {a.artist.genres.slice(0, 2).join(", ")}
                    </p>
                </div>
            </div>
        {/each}
    </div>
</form>
