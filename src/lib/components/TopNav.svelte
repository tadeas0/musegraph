<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="flex w-full flex-row justify-between">
    <a class="underline" href={`/artist/${$page.params.artistId}/graph`}>graph</a>
    <a class="underline" href={`/artist/${$page.params.artistId}`}>list</a>
    <a class="underline" href="/">search</a>
</div>
