<script lang="ts">
    import { SESSION_CONTEXT_KEY } from "$lib/constants";
    import type { ArtistSimilar } from "$lib/types/ArtistSimilar";
    import { getContext } from "svelte";
    import type { SessionStore } from "$lib/stores/SessionStore";
    import { toast } from "$lib/notification";
    import { createPlaylist } from "$lib/api";
    import { goto } from "$app/navigation";
    import { spotifyUserStore } from "$lib/stores/SpotifyProfileStore";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";

    const sessionStore: SessionStore = getContext(SESSION_CONTEXT_KEY);
    let selectedArtists: string[] = [];
    let loading = false;

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
                toast("Missing playlist name", "error");
            } else if (artists.length === 0) {
                toast("No artists selected", "error");
            } else if ($spotifyUserStore) {
                const playlist = await createPlaylist(
                    name.toString(),
                    artists,
                    $spotifyUserStore.token.token
                );
                goto(`./playlist/created?${new URLSearchParams({ ...playlist })}`);
            } else {
                toast("User not logged in", "error");
            }
        } catch (err) {
            if (err instanceof Error) {
                toast(err.message, "error");
            } else {
                toast("Something went wrong", "error");
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
    class="flex w-full flex-col items-center gap-8 lg:w-4/6"
    on:submit|preventDefault={handleSubmit}
>
    {#if loading}
        <LoadingOverlay spinnerPosition="top" />
    {/if}
    <div class="ml-auto flex w-36 flex-col items-stretch">
        <button class="rounded-md bg-blue-400 p-2 text-white" type="submit">
            Create playlist
        </button>
    </div>
    <input
        name="name"
        class="self-start rounded-md border-2 border-blue-400 p-2"
        placeholder="Playlist name"
    />
    <fieldset class="flex w-full flex-col items-start gap-4 border-t-2">
        <div class="my-4 flex items-start space-x-2">
            <input
                class="mr-4"
                type="checkbox"
                checked={areAllSelected}
                id="selectAll"
                on:click={handleSelectAll}
            />
            <div class="grid gap-1.5 leading-none">
                <label for="selectAll" class="text-xl font-medium leading-none">
                    Select all
                </label>
                <p class="text-sm text-slate-600">{selectedArtists.length} selected</p>
            </div>
        </div>
        {#each artistList as a}
            <div class="flex items-start space-x-2 pl-4">
                <input
                    class="mr-4"
                    type="checkbox"
                    name="artists"
                    value={a.artist.name}
                    id={a.artist.name}
                    bind:group={selectedArtists}
                />
                <div class="grid gap-1.5 leading-none">
                    <label for={a.artist.name} class="text-lg font-medium leading-none">
                        {a.artist.name}
                    </label>
                    <p class="text-sm text-slate-600">
                        {a.artist.genres.join(", ")}
                    </p>
                </div>
            </div>
        {/each}
    </fieldset>
</form>
