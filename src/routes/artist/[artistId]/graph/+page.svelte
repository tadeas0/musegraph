<script lang="ts">
    import { ARTIST_STACK_KEY } from "$lib/constants";
    import type { ArtistStackStore } from "$lib/stores/ArtistStackStore";
    import { getContext } from "svelte";
    import { fetchArtist } from "$lib/api";
    import type { Artist } from "$lib/types/Artist";
    import Graph, { type GraphEdge, type GraphNode } from "$lib/components/Graph.svelte";
    import type { ArtistSimilar } from "$lib/types/ArtistSimilar";
    import Spinner from "$lib/components/Spinner.svelte";
    import { goto } from "$app/navigation";
    import colors from "tailwindcss/colors";

    const artistStack = getContext<ArtistStackStore>(ARTIST_STACK_KEY);

    const DEFAULT_NODE_COLOR = colors.blue[400];
    const DISCOVERED_NODE_COLOR = colors.blue[200];
    const SELECTED_NODE_COLOR = colors.amber[300];

    let selectedNodeId: string | null = null;
    let nodes: GraphNode<Artist>[] = [];
    let edges: GraphEdge<{}>[] = [];
    let loading = false;

    function artistsToGraph(
        artists: ArtistSimilar[]
    ): [GraphNode<Artist>[], GraphEdge<{}>[]] {
        const nodes: GraphNode<Artist>[] = [];
        const edges: GraphEdge<{}>[] = [];

        for (const a of artists) {
            const id = a.artist.name;
            const name = a.artist.name;
            const data = a.artist;
            let color: string = DISCOVERED_NODE_COLOR;

            if (a.artist.name === selectedNodeId) {
                color = SELECTED_NODE_COLOR;
            }

            if (!nodes.find((n) => n.id === id)) {
                nodes.push({ id, name, data, color });
            }
        }

        for (const artistSimilar of artists) {
            const srcArtist = artistSimilar.artist;
            const srcId = srcArtist.name;

            for (const tgtArtist of artistSimilar.similarArtists) {
                const tgtId = tgtArtist.name;
                if (edges.find((e) => e.source === srcId && e.target === tgtId)) continue;
                let color = DEFAULT_NODE_COLOR;
                if (!nodes.find((n) => n.id === srcId)) {
                    nodes.push({
                        id: srcId,
                        name: srcArtist.name,
                        data: srcArtist,
                        color: color
                    });
                }
                if (!nodes.find((n) => n.id === tgtId)) {
                    nodes.push({
                        id: tgtId,
                        name: tgtArtist.name,
                        data: tgtArtist,
                        color: color
                    });
                }
                edges.push({ source: srcId, target: tgtId, data: {} });
            }
        }

        return [nodes, edges];
    }

    artistStack.subscribe((stack) => {
        selectedNodeId = stack.at(-1)?.artist.name || null;
        [nodes, edges] = artistsToGraph(stack);
    });

    async function handleArtistClick(artist: Artist) {
        try {
            loading = true;
            const oldArtist = $artistStack.find((a) => a.artist.name === artist.name);
            if (!oldArtist) {
                const data = await fetchArtist(artist.dbpediaUrl, fetch);
                artistStack.add(data);
                goto(`/artist/${btoa(data.artist.dbpediaUrl)}/graph`);
            } else {
                artistStack.add(oldArtist);
                goto(`/artist/${btoa(oldArtist.artist.dbpediaUrl)}/graph`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            loading = false;
        }
    }
</script>

<div class="relative h-[85vh] w-screen border-b-2">
    {#if loading}
        <div
            class="absolute left-0 top-0 z-20 flex h-full w-full justify-center bg-white bg-opacity-80"
        >
            <div class="mt-52 w-10">
                <Spinner />
            </div>
        </div>
    {/if}
    <Graph
        {nodes}
        {edges}
        {selectedNodeId}
        on:nodeClick={(n) => {
            handleArtistClick(n.detail.data);
        }}
    />
</div>
