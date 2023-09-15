<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { fetchCurrentSpotifyUser } from "$lib/api";
    import { spotifyUserStore } from "$lib/stores/SpotifyProfileStore";
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    onMount(async () => {
        const sp = new URLSearchParams($page.url.hash.slice(1));
        const expiresIn = Number(sp.get("expires_in"));
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + (expiresIn - 100));
        const token = "Bearer " + sp.get("access_token");
        try {
            const user = await fetchCurrentSpotifyUser(token, fetch);
            $spotifyUserStore = { ...user, token: { expiration, token } };
        } catch (err) {
            $spotifyUserStore = null;
        }

        goto(data.redirectUrl);
    });
</script>
