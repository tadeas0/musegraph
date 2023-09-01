<script lang="ts">
    import Spinner from "./Spinner.svelte";

    type SpinnerPosition = "top" | "bottom" | "center";

    export let spinnerPosition: SpinnerPosition = "center";

    const POSITION_CLASSES: Record<SpinnerPosition, string> = {
        top: "top-0 mt-20",
        bottom: "bottom-0 mb-20",
        center: "top-1/2 -translate-y-1/2"
    };
</script>

<div
    class="absolute left-0 top-0 z-20 flex h-full w-full items-start justify-center bg-white bg-opacity-80"
>
    <div
        class={`absolute left-1/2 w-10 -translate-x-1/2 ${POSITION_CLASSES[spinnerPosition]}`}
    >
        <Spinner />
    </div>
</div>
