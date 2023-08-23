<script lang="ts" context="module">
    export interface GraphNode<N> extends NodeObject {
        id: string;
        name: string;
        color?: string | CanvasGradient | CanvasPattern;
        data: N;
    }

    export interface GraphEdge<E> extends LinkObject {
        source: string;
        target: string;
        data: E;
    }
</script>

<script lang="ts">
    import ForceGraph, {
        type ForceGraphInstance,
        type LinkObject,
        type NodeObject
    } from "force-graph";
    import { createEventDispatcher, onMount } from "svelte";
    import MdFilterCenterFocus from "svelte-icons/md/MdFilterCenterFocus.svelte";
    import MdZoomIn from "svelte-icons/md/MdZoomIn.svelte";
    import MdZoomOut from "svelte-icons/md/MdZoomOut.svelte";
    import TiArrowSync from "svelte-icons/ti/TiArrowSync.svelte";
    import colors from "tailwindcss/colors";

    const ZOOM_AMOUNT = 0.5;
    const DEFAULT_NODE_COLOR = colors.blue[400];

    type N = $$Generic;
    type E = $$Generic;

    export let nodes: GraphNode<N>[];
    export let edges: GraphEdge<E>[];
    export let selectedNodeId: GraphNode<N>["id"] | null = null;

    const dispatch = createEventDispatcher();

    let graph: ForceGraphInstance;
    let graphContainer: HTMLDivElement;
    let finishedFirstZoom = false;
    let selectedNode: GraphNode<N> | null = null;

    $: selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

    onMount(() => {
        const ids = nodes.map((n) => n.id);
        const idsSet = new Set(ids);

        if (ids.length !== idsSet.size) {
            throw new Error("Node ids are not unique");
        }

        for (const e of edges) {
            if (!idsSet.has(e.source)) {
                throw new Error(`Id of edge source \"${e.source}\" not in nodes`);
            } else if (!idsSet.has(e.target)) {
                throw new Error(`Id of edge target \"${e.target}\" not in nodes`);
            }
        }

        graph = ForceGraph();
        graph
            .nodeCanvasObject((node, ctx, globalScale) => {
                const graphNode = node as GraphNode<N>;
                const { x, y } = graphNode;
                if (x === undefined || y === undefined) return;
                const label = graphNode.name;
                const fontSize = 14 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;

                if (graphNode.color === undefined) {
                    ctx.fillStyle = DEFAULT_NODE_COLOR;
                } else {
                    ctx.fillStyle = graphNode.color;
                }
                const radius = Math.min(24 / globalScale, 6);
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
                ctx.fill();

                if (selectedNodeId === graphNode.id || globalScale > 1.5) {
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
                dispatch("nodeClick", node as GraphNode<N>);
            })
            .linkDirectionalArrowLength(2)
            .linkDirectionalArrowRelPos(0.75)
            .graphData({ nodes: nodes, links: edges })
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

    $: {
        if (graph) {
            graph.graphData({ nodes: nodes, links: edges });
        }
    }
</script>

<div
    class="absolute left-1/2 top-0 z-10 flex h-10 -translate-x-1/2 flex-row gap-8 text-gray-600"
>
    <button on:click={() => handleZoom(1 / ZOOM_AMOUNT)}><MdZoomIn /></button>
    <button on:click={() => handleZoom(ZOOM_AMOUNT)}><MdZoomOut /></button>
    <button on:click={handleReset}><TiArrowSync /></button>
    <button on:click={handleFit}><MdFilterCenterFocus /></button>
</div>
<div class="h-full" bind:this={graphContainer} />
