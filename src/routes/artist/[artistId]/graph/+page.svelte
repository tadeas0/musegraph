<script lang="ts">
    import { ARTIST_STACK_KEY } from "$lib/constants";
    import type { ArtistStackStore } from "$lib/stores/ArtistStackStore";
    import { getContext, onMount } from "svelte";
    import ForceGraph, {
        type ForceGraphInstance,
        type LinkObject,
        type NodeObject
    } from "force-graph";
    import { fetchArtist } from "$lib/api";
    import type { Artist } from "$lib/types/Artist";
    import colors from "tailwindcss/colors";
    import MdZoomIn from "svelte-icons/md/MdZoomIn.svelte";
    import MdZoomOut from "svelte-icons/md/MdZoomOut.svelte";
    import TiArrowSync from "svelte-icons/ti/TiArrowSync.svelte";
    import MdFilterCenterFocus from "svelte-icons/md/MdFilterCenterFocus.svelte";

    interface ArtistNode extends NodeObject {
        artist: Artist;
        discovered: boolean;
    }

    const ZOOM_AMOUNT = 0.5;

    let graphContainer: HTMLDivElement;
    let graph: ForceGraphInstance | null = null;
    let finishedFirstZoom = false;

    $: selectedNode = graph
        ?.graphData()
        .nodes.find((n) => n.id === $artistStack.at(-1)?.artist.name) as
        | ArtistNode
        | undefined;

    const artistStack = getContext<ArtistStackStore>(ARTIST_STACK_KEY);

    function artistToNode(artist: Artist, discovered = false): ArtistNode {
        return { id: artist.name, artist: artist, discovered: discovered };
    }

    artistStack.subscribe((stack) => {
        if (!graph) return;
        const { nodes } = graph.graphData();
        let newNodes: ArtistNode[] = [];
        let newEdges: LinkObject[] = [];
        for (const a of stack) {
            if (!newNodes.find((n) => n.id === a.artist.name)) {
                const oldNode = nodes.find((n) => n.id === a.artist.name) as ArtistNode;
                if (oldNode) newNodes.push(oldNode);
                else newNodes.push(artistToNode(a.artist));
            }

            for (const similar of a.similarArtists) {
                if (!newNodes.find((n) => n.id === similar.name)) {
                    const oldNode = nodes.find(
                        (n) => n.id === similar.name
                    ) as ArtistNode;
                    if (oldNode) newNodes.push(oldNode);
                    else newNodes.push(artistToNode(similar));
                }

                if (
                    !newEdges.find(
                        (n) => n.source === a.artist.name && n.target === similar.name
                    )
                ) {
                    newEdges.push({ source: a.artist.name, target: similar.name });
                }
            }
        }

        graph.graphData({ nodes: newNodes, links: newEdges });
    });

    async function handleArtistClick(artist: Artist) {
        if (!graph) return;
        const data = await fetchArtist(artist.dbpediaUrl, fetch);
        artistStack.add(data);
    }

    onMount(() => {
        let newNodes: ArtistNode[] = [];
        let newEdges: LinkObject[] = [];
        for (const a of $artistStack) {
            if (!newNodes.find((n) => n.id === a.artist.name)) {
                newNodes.push(artistToNode(a.artist));
            }

            for (const similar of a.similarArtists) {
                if (!newNodes.find((n) => n.id === similar.name)) {
                    newNodes.push(artistToNode(similar));
                }

                if (
                    !newEdges.find(
                        (n) => n.source === a.artist.name && n.target === similar.name
                    )
                ) {
                    newEdges.push({ source: a.artist.name, target: similar.name });
                }
            }
        }

        graph = ForceGraph();
        graph
            .nodeCanvasObject((node, ctx, globalScale) => {
                const artistNode = node as ArtistNode;
                const { x, y } = artistNode;
                if (x === undefined || y === undefined) return;
                const label = artistNode.artist.name;
                const fontSize = 14 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;

                if (selectedNode === artistNode) {
                    artistNode.discovered = true;
                    ctx.fillStyle = colors.amber[300];
                } else if (artistNode.discovered) {
                    ctx.fillStyle = colors.blue[200];
                } else {
                    ctx.fillStyle = colors.blue[400];
                }
                const radius = Math.min(24 / globalScale, 6);
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
                ctx.fill();

                if (selectedNode === artistNode || globalScale > 1.5) {
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = colors.black;
                    ctx.fillText(label, x, y - 32 / globalScale);
                }
            })
            .cooldownTicks(50)
            .d3Force("center", null)
            .width(graphContainer.clientWidth)
            .height(graphContainer.clientHeight)
            .onNodeClick((node) => {
                if (!graph) return;
                (node as ArtistNode).discovered = true;
                handleArtistClick((node as ArtistNode).artist);
            })
            .linkDirectionalArrowLength(2)
            .linkDirectionalArrowRelPos(0.75)
            .graphData({ nodes: newNodes, links: newEdges })
            .onEngineStop(() => {
                if (!selectedNode) return;
                graph?.centerAt(selectedNode.x, selectedNode.y, 1000);
                if (!finishedFirstZoom) {
                    graph?.zoom(4, 1000);
                    finishedFirstZoom = true;
                }
            })(graphContainer);
    });

    function handleReset() {
        if (!selectedNode) return;
        graph?.centerAt(selectedNode.x, selectedNode.y, 1000);
        graph?.zoom(4, 1000);
    }

    function handleFit() {
        graph?.zoomToFit(1000, 20);
    }

    function handleZoom(delta: number) {
        const curr = graph?.zoom();
        if (curr) graph?.zoom(curr * delta, 500);
    }
</script>

<div class="relative h-[85vh] w-screen border-b-2">
    <div class="h-full" bind:this={graphContainer} />
    <div
        class="absolute left-1/2 top-0 flex h-10 -translate-x-1/2 flex-row gap-8 text-gray-600"
    >
        <button on:click={() => handleZoom(1 / ZOOM_AMOUNT)}><MdZoomIn /></button>
        <button on:click={() => handleZoom(ZOOM_AMOUNT)}><MdZoomOut /></button>
        <button on:click={handleReset}><TiArrowSync /></button>
        <button on:click={handleFit}><MdFilterCenterFocus /></button>
    </div>
</div>
