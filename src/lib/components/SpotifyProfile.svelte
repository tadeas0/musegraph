<script lang="ts">
    import type { SpotifyProfile } from "$lib/types/SpotifyProfile";
    import { Avatar, popup } from "@skeletonlabs/skeleton";
    import { createEventDispatcher } from "svelte";
    import type { PopupSettings } from "@skeletonlabs/skeleton";
    import MdArrowDropDown from "svelte-icons/md/MdArrowDropDown.svelte";

    export let profile: SpotifyProfile;

    const dispatch = createEventDispatcher();

    const popupFeatured: PopupSettings = {
        event: "click",
        target: "popupFeatured",
        placement: "bottom"
    };
</script>

<button class="card card-hover flex items-center gap-4 p-4" use:popup={popupFeatured}>
    <Avatar src={profile.image} width="w-9" />
    <span class="h4 font-semibold">{profile.displayName}</span>
    <span class="w-9"><MdArrowDropDown /></span>
</button>
<div class="card p-2 shadow-xl" data-popup="popupFeatured">
    <ul>
        <li>
            <button
                class="btn rounded-none text-error-600 bg-error-hover-token"
                on:click={() => dispatch("logout")}
            >
                Log out
            </button>
        </li>
    </ul>
    <div class="arrow bg-surface-100-800-token" />
</div>
