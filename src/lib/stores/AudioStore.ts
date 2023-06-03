import { writable } from "svelte/store";

export const playingAudio = writable<HTMLAudioElement | null>(null);

export function stopAudio() {
    playingAudio.update((a) => {
        a?.pause();
        return null;
    });
}
