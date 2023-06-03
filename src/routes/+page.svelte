<script lang="ts">
    import { getArtistsByName } from "$lib/DBPediaClient";
    import type { Artist } from "$lib/types/Artist";
    import MdSearch from "svelte-icons/md/MdSearch.svelte";
    import MdAutorenew from "svelte-icons/md/MdAutorenew.svelte";
    import { fetchArtistsByName } from "$lib/api";

    let artistName = "";
    let foundArtists: Artist[] = [];
    let loading = false;

    async function search() {
        loading = true;
        const data = await fetchArtistsByName(artistName, fetch);
        foundArtists = data.artists;
        loading = false;
    }
</script>

<div class="flex flex-col items-center">
    <div class="max-w-5xl">
        <form on:submit={search} class="flex flex-row">
            <input
                class="rounded-l-md border-2 border-blue-400 p-2 outline-none"
                placeholder="Artist"
                bind:value={artistName}
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
                    <a href={`/artist/${btoa(a.dbpediaUrl)}`}>{a.name}</a>
                </div>
            {/each}
        </div>
    </div>
</div>
