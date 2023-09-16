<script lang="ts">
    import { onMount } from "svelte";
    import MdArrowDownward from "svelte-icons/md/MdArrowDownward.svelte";
    import MdArrowUpward from "svelte-icons/md/MdArrowUpward.svelte";
    import { fly } from "svelte/transition";

    const SCROLL_BUTTON_THRESHOLD = 100;
    let showScrollButton: "top" | "bottom" | "none" = "none";

    function handleScroll(e: Event) {
        const target = e.currentTarget as HTMLDivElement;
        updateButton(target);
    }

    function updateButton(target: HTMLElement) {
        if (target.scrollHeight <= target.clientHeight) {
            showScrollButton = "none";
        } else if (target.scrollTop > SCROLL_BUTTON_THRESHOLD) {
            showScrollButton = "top";
        } else if (target.scrollTop === 0) {
            showScrollButton = "bottom";
        } else {
            showScrollButton = "none";
        }
    }

    function scrollToTop() {
        const elemPage = document.querySelector("#page");
        if (elemPage) {
            elemPage.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    function scrollToBottom() {
        const elemPage = document.querySelector("#page");
        if (elemPage) {
            elemPage.scrollTo({ top: elemPage.scrollHeight, behavior: "smooth" });
        }
    }

    onMount(() => {
        const page = document.querySelector("#page") as HTMLDivElement;
        page.addEventListener("scroll", handleScroll);

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((v) => {
                updateButton(v.target as HTMLElement);
            });
        });
        resizeObserver.observe(page);

        return () => {
            page.removeEventListener("scroll", handleScroll);
            resizeObserver.disconnect();
        };
    });
</script>

{#if showScrollButton === "top"}
    <button
        transition:fly={{ y: 10 }}
        class="btn btn-icon variant-glass-primary absolute bottom-4 right-4"
        on:click={scrollToTop}
    >
        <MdArrowUpward />
    </button>
{:else if showScrollButton === "bottom"}
    <button
        transition:fly={{ y: 10 }}
        class="btn btn-icon variant-glass-primary absolute bottom-4 right-4"
        on:click={scrollToBottom}
    >
        <MdArrowDownward />
    </button>
{/if}
