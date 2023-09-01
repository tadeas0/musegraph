<script lang="ts">
    import ArtistHeader from "$lib/components/ArtistHeader.svelte";
    import { SESSION_CONTEXT_KEY } from "$lib/constants";
    import type { SessionStore } from "$lib/stores/SessionStore";
    import { getContext } from "svelte";

    const sessionStore: SessionStore = getContext(SESSION_CONTEXT_KEY);
</script>

<ArtistHeader artistStack={$sessionStore} />
<slot />
