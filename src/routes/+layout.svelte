<script>
    import Toast from "$lib/components/Toast.svelte";
    import TopNav from "$lib/components/TopNav.svelte";
    import "../app.css";
</script>

<Toast />
<TopNav />
<main class="flex h-screen flex-col items-center p-4">
    <slot />
</main>
