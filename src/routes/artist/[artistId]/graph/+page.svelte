<script lang="ts">
    import { ARTIST_STACK_KEY } from "$lib/constants";
    import type { ArtistStackStore } from "$lib/stores/ArtistStackStore";
    import { getContext, onMount } from "svelte";
    import ForceGraph, { type LinkObject, type NodeObject } from "force-graph";
    import { fetchArtist } from "$lib/api";
    import type { Artist } from "$lib/types/Artist";

    interface ArtistNode extends NodeObject {
        artist: Artist;
    }

    let graphContainer: HTMLDivElement;

    const artistStack = getContext<ArtistStackStore>(ARTIST_STACK_KEY);

    async function handleArtistClick(artist: Artist) {
        const data = await fetchArtist(artist.dbpediaUrl, fetch);
        artistStack.add(data);
    }

    onMount(() => {
        const nodes: ArtistNode[] = [];
        const edges: LinkObject[] = [];

        for (const a of $artistStack) {
            const newNode = nodes.find((n) => n.id === a.artist.name);
            if (!newNode) {
                nodes.push({
                    id: a.artist.name,
                    artist: a.artist
                });
            }
            for (const s of a.similarArtists) {
                edges.push({
                    source: a.artist.name,
                    target: s.name
                });
                if (!nodes.find((n: any) => n.id === s.name)) {
                    nodes.push({ id: s.name, artist: s });
                }
            }
        }
        const graph = ForceGraph();
        graph
            .nodeCanvasObject((node, ctx, globalScale) => {
                const artistNode = node as ArtistNode;
                const { x, y } = artistNode;
                if (x === undefined || y === undefined) return;
                const label = artistNode.artist.name;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;

                ctx.fillStyle = "rgb(96,165,250)";
                ctx.beginPath();
                ctx.arc(x, y, 24 / globalScale, 0, 2 * Math.PI, false);
                ctx.fill();

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "rgba(0, 0, 0, 1)";
                ctx.fillText(label, x, y - 32 / globalScale);
            })
            .graphData({ nodes: nodes, links: edges })
            .cooldownTicks(100)
            .d3Force("center", null)
            .width(graphContainer.clientWidth)
            .height(graphContainer.clientHeight)
            .onNodeClick((node) => {
                handleArtistClick((node as ArtistNode).artist);
            });
        graph.onEngineStop(() => graph.zoomToFit(400))(graphContainer);
    });
</script>

<div class="h-[90vh]">
    <div class="h-full border-2" bind:this={graphContainer} />
</div>
