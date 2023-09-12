<script lang="ts">
    import type { SpotifyProfile } from "$lib/types/SpotifyProfile";
    import { createEventDispatcher } from "svelte";

    export let profile: SpotifyProfile;

    const dispatch = createEventDispatcher();
</script>

<div class="flex items-center rounded-md border-2 border-blue-200 p-2">
    <img class="mr-2 h-8 rounded-full" alt="avatar" src={profile.image} />
    <h1 class="mr-4 text-lg font-medium leading-none">
        {profile.displayName}
    </h1>
    <button
        on:click={() => dispatch("logout")}
        class="rounded-md bg-red-600 p-1 text-sm text-red-100 hover:bg-red-800"
        >Log out</button
    >
</div>
