<script>
    import Toast from "$lib/components/Toast.svelte";
    import TopNav from "$lib/components/TopNav.svelte";
    import "../app.css";
</script>

<main class="flex h-screen flex-col items-center gap-2 p-4">
    <Toast />
    <TopNav />
    <slot />
</main>
