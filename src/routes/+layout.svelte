<script>
    import Toast from "$lib/components/Toast.svelte";
    import { onMount } from "svelte";
    import "../app.css";
    import { spotifyUserStore } from "$lib/stores/SpotifyProfileStore";
    import { fetchCurrentSpotifyUser } from "$lib/api";

    onMount(async () => {
        try {
            if ($spotifyUserStore) {
                const token = $spotifyUserStore.token;
                const profile = await fetchCurrentSpotifyUser(token.token, fetch);
                $spotifyUserStore = { ...profile, token };
            }
        } catch (err) {
            $spotifyUserStore = null;
        }
    });
</script>

<Toast />
<slot />
