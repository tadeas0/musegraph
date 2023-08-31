<script lang="ts">
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
    import { artistStack } from "$lib/stores/ArtistStackStore";
    import ArtistHeader from "$lib/components/ArtistHeader.svelte";

    export let data: LayoutData;

    onMount(() => {
        artistStack.clear();
        artistStack.add(data);
    });
</script>

<ArtistHeader />
<slot />
