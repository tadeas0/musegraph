<script lang="ts">
    import FaSpotify from "svelte-icons/fa/FaSpotify.svelte";

    export let redirectUrl: string = "/";
    export let text: string = "Log in";
    export let classes: string = "";
    $: searchParams = new URLSearchParams({ redirectUrl: redirectUrl });
</script>

<a class={`btn variant-filled-primary ${classes}`} href={`/spotify/auth?${searchParams}`}>
    <span class="w-6"><FaSpotify /></span>
    <span>{text}</span>
</a>
