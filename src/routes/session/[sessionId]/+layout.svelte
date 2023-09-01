<script lang="ts">
    import TopNav from "$lib/components/TopNav.svelte";
    import { SESSION_CONTEXT_KEY } from "$lib/constants";
    import { createSessionStore } from "$lib/stores/SessionStore";
    import type { Session } from "$lib/types/Session";
    import { onMount, setContext } from "svelte";

    export let data: Session;

    const sessionStore = createSessionStore(data.id);
    setContext(SESSION_CONTEXT_KEY, sessionStore);

    onMount(async () => {
        await sessionStore.set(data.artistStack);
    });
</script>

<TopNav />
<main class="flex h-screen flex-col items-center p-4">
    <slot />
</main>
