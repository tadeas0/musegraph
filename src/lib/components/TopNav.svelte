<script lang="ts">
    import { page } from "$app/stores";
</script>

<nav class="flex w-full flex-row justify-between p-4">
    <a class="underline" href={`/session/${$page.params.sessionId}/discover/graph`}>
        graph
    </a>
    <a class="underline" href={`/session/${$page.params.sessionId}/discover`}>list</a>
    <a class="underline" href="/">search</a>
</nav>
