<script lang="ts">
    import { ARTIST_STACK_KEY } from "$lib/constants";
    import { createArtistStack } from "$lib/stores/ArtistStackStore";
    import { setContext } from "svelte";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const artistStackStore = createArtistStack();

    setContext(ARTIST_STACK_KEY, artistStackStore);

    onMount(() => {
        artistStackStore.clear();
        artistStackStore.add(data);
    });
</script>

<slot />
