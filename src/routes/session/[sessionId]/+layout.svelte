<script lang="ts">
    import { SESSION_CONTEXT_KEY } from "$lib/constants";
    import { createSessionStore } from "$lib/stores/SessionStore";
    import type { Session } from "$lib/types/Session";
    import { AppShell, AppBar } from "@skeletonlabs/skeleton";
    import { onMount, setContext } from "svelte";
    import MdTimeline from "svelte-icons/md/MdTimeline.svelte";
    import MdSearch from "svelte-icons/md/MdSearch.svelte";
    import MdFormatListBulleted from "svelte-icons/md/MdFormatListBulleted.svelte";
    import { page } from "$app/stores";

    export let data: Session;

    const sessionStore = createSessionStore(data.id);
    setContext(SESSION_CONTEXT_KEY, sessionStore);

    onMount(async () => {
        await sessionStore.set(data.artistStack);
    });
</script>

<AppShell slotPageContent="lg:px-64 md:px-32 p-2">
    <svelte:fragment slot="header">
        <AppBar slotDefault="place-self-center" slotTrail="place-content-end">
            <svelte:fragment slot="lead">
                <a href="/" class="gradient-heading h2 font-bold">MuseGraph</a>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <a href={`/session/${$page.params.sessionId}/discover/graph`} class="w-7">
                    <MdTimeline />
                </a>
                <a href={`/session/${$page.params.sessionId}/discover`} class="w-7">
                    <MdFormatListBulleted />
                </a>
                <a href="/search" class="w-7"><MdSearch /></a>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <slot />
</AppShell>
