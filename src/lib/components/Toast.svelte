<script lang="ts">
    import { cubicOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import { notifications, type NotificationType } from "$lib/notification";

    const COLOR_CLASS: Record<NotificationType, string> = {
        success: "border-emerald-200 bg-emerald-100 text-emerald-950",
        default: "border-slate-300 bg-slate-200 text-slate-950",
        error: "border-red-200 bg-red-100 text-red-900",
        warn: "border-amber-200 bg-amber-100 text-amber-900"
    } as const;
</script>

<div class={`fixed left-1/2 top-3 w-64 -translate-x-1/2 `}>
    <slot />
</div>

{#if $notifications}
    <div class="fixed left-1/2 top-3 z-20 w-64 -translate-x-1/2">
        {#each $notifications as notification}
            <div
                role="alert"
                class={`mb-2 rounded-md border-2 px-4 py-1 ${
                    COLOR_CLASS[notification.type]
                }`}
                transition:fly={{ y: -10, easing: cubicOut, duration: 200 }}
            >
                {notification.message}
            </div>
        {/each}
    </div>
{/if}
