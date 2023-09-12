<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import ArtistHeader from "$lib/components/ArtistHeader.svelte";
    import { SESSION_CONTEXT_KEY } from "$lib/constants";
    import { stopAudio } from "$lib/stores/AudioStore";
    import type { SessionStore } from "$lib/stores/SessionStore";
    import { getContext } from "svelte";

    const sessionStore: SessionStore = getContext(SESSION_CONTEXT_KEY);

    beforeNavigate(() => {
        stopAudio();
    });
</script>

<ArtistHeader artistStack={$sessionStore} />
<slot />
