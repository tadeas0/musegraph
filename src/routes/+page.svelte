<script lang="ts">
    import type { Artist } from "$lib/types/Artist";
    import MdSearch from "svelte-icons/md/MdSearch.svelte";
    import MdAutorenew from "svelte-icons/md/MdAutorenew.svelte";
    import { createSession, fetchArtist, fetchArtistsByName } from "$lib/api";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import { toast } from "$lib/notification";
    import { goto } from "$app/navigation";
    import { artistStack } from "$lib/stores/ArtistStackStore";

    let artistName = "";
    let foundArtists: Artist[] = [];
    let loading = false;
    let gettingArtist = false;

    async function search() {
        try {
            loading = true;
            const data = await fetchArtistsByName(artistName, fetch);
            foundArtists = data.artists;
            if (foundArtists.length === 0) {
                toast("Could not find any artists matching your query.", "warn");
            }
        } catch (err) {
            toast("Error while searching for artists. Please try again.", "error");
        } finally {
            loading = false;
        }
    }

    async function handleNavigate(dbpediaUrl: string) {
        try {
            gettingArtist = true;
            const data = await fetchArtist(dbpediaUrl, fetch);
            artistStack.clear();
            artistStack.add(data);
            const session = await createSession($artistStack);
            goto(`/session/${session.id}`);
        } catch (err) {
            console.error(err);
            toast("Could not get artist.", "error");
        } finally {
            gettingArtist = false;
        }
    }
</script>

<div class="relative flex flex-col items-center">
    {#if gettingArtist}
        <LoadingOverlay />
    {/if}
    <div class="mt-20 max-w-5xl">
        <form on:submit={search} class="flex flex-row">
            <input
                class="rounded-l-md border-2 border-blue-400 p-2 outline-none disabled:border-gray-400"
                placeholder="Artist"
                bind:value={artistName}
                disabled={loading}
            />
            <button
                class:bg-blue-500={!loading}
                class:bg-gray-500={loading}
                class="w-12 rounded-r-md p-2 text-white"
                type="submit"
                disabled={loading}
            >
                {#if loading}
                    <div class="animate-spin">
                        <MdAutorenew />
                    </div>
                {:else}
                    <MdSearch />
                {/if}
            </button>
        </form>
        <div>
            {#each foundArtists as a}
                <div class="border-b-2 border-blue-200 p-4">
                    <button on:click={() => handleNavigate(a.dbpediaUrl)}>
                        {a.name}
                    </button>
                </div>
            {/each}
        </div>
    </div>
</div>
