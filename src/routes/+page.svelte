<script lang="ts">
    import MdArrowForward from "svelte-icons/md/MdArrowForward.svelte";
</script>

<div class="mt-8 flex flex-col items-start justify-start p-2 md:flex-row">
    <div class="relative flex flex-col items-center md:items-start lg:px-64">
        <a href="/" class="gradient-heading h1 mb-4 font-bold">MuseGraph</a>
        <h2 class="h2 mb-2 max-w-lg text-center md:text-left">
            The music recommendation and visualization system
        </h2>
        <p class="mb-8 max-w-lg px-8 text-justify md:px-0">
            <b>MuseGraph</b> allows you to discover artists, visualize their connections to
            other interprets and create playlists based on those connections.
        </p>
        <a href="/search" class="btn variant-filled-primary">
            <span>Get started</span>
            <span class="w-6"><MdArrowForward /></span>
        </a>
    </div>
    <img
        alt="illustrative graph"
        class="blur-sm backdrop-blur-sm hover:drop-shadow-xl"
        src="/images/graph.png"
    />
</div>
