<script lang="ts">
    import { fetchArtist } from "$lib/api";
    import type { Artist } from "$lib/types/Artist";
    import Graph, { type GraphEdge, type GraphNode } from "$lib/components/Graph.svelte";
    import type { ArtistSimilar } from "$lib/types/ArtistSimilar";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import { getContext } from "svelte";
    import { SESSION_CONTEXT_KEY } from "$lib/constants";
    import type { SessionStore } from "$lib/stores/SessionStore";
    import { stopAudio } from "$lib/stores/AudioStore";
    import type { PageServerData } from "./$types";
    import { getToastStore } from "@skeletonlabs/skeleton";

    export let data: PageServerData;

    const DEFAULT_NODE_COLOR = data.colors.secondary;
    const DISCOVERED_NODE_COLOR = data.colors.tertiary;
    const SELECTED_NODE_COLOR = data.colors.primary;

    let selectedNodeId: string | null = null;
    let nodes: GraphNode<Artist>[] = [];
    let edges: GraphEdge<{}>[] = [];
    let loading = false;
    let graphContainer: HTMLDivElement;

    const sessionStore: SessionStore = getContext(SESSION_CONTEXT_KEY);
    const toastStore = getToastStore();

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
                nodes.push({ id, name, data, color, alwaysShowLabel: true });
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
                        color: color,
                        alwaysShowLabel: false
                    });
                }
                if (!nodes.find((n) => n.id === tgtId)) {
                    nodes.push({
                        id: tgtId,
                        name: tgtArtist.name,
                        data: tgtArtist,
                        color: color,
                        alwaysShowLabel: false
                    });
                }
                edges.push({ source: srcId, target: tgtId, data: {} });
            }
        }

        return [nodes, edges];
    }

    sessionStore.subscribe((stack) => {
        selectedNodeId = stack.at(-1)?.artist.name || null;
        [nodes, edges] = artistsToGraph(stack);
    });

    async function handleArtistClick(artist: Artist) {
        try {
            loading = true;
            const oldArtist = $sessionStore.find((a) => a.artist.name === artist.name);
            if (!oldArtist) {
                const data = await fetchArtist(artist.dbpediaUrl, fetch);
                await sessionStore.add(data);
            } else {
                await sessionStore.add(oldArtist);
            }
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: "Could not get artist. Please try again.",
                background: "variant-filled-error"
            });
        } finally {
            stopAudio();
            loading = false;
        }
    }
</script>

<div class="mt-2 border-secondary-500">
    <div
        bind:this={graphContainer}
        class="relative h-[80vh] w-full rounded-md border-2 border-primary-600"
    >
        {#if loading}
            <LoadingOverlay />
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
</div>
