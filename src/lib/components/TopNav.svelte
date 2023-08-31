<script lang="ts">
    import { page } from "$app/stores";
</script>

<nav class="flex w-full flex-row justify-between p-4">
    <a class="underline" href={`/artist/${$page.params.artistId}/graph`}>graph</a>
    <a class="underline" href={`/artist/${$page.params.artistId}`}>list</a>
    <a class="underline" href="/">search</a>
</nav>
