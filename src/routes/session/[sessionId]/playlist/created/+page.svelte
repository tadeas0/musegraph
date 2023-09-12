<script lang="ts">
    import type { SpotifyPlaylist } from "$lib/types/SpotifyPlaylist";
    import { page } from "$app/stores";

    export let data: SpotifyPlaylist;
</script>

<div class="flex w-full flex-col items-center lg:w-4/6">
    <h1 class="mt-4 text-xl">
        Created playlist <span class="font-bold">{data.name}</span>
    </h1>
    <a target="_blank" href={data.url} class="mt-6 rounded-md bg-blue-400 p-2 text-white">
        Show on spotify
    </a>
    <a
        href={`/session/${$page.params.sessionId}/discover/graph`}
        class="mt-6 rounded-md bg-red-500 p-2 text-white"
    >
        Back to graph
    </a>
</div>
