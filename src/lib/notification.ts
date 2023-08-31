import { writable } from "svelte/store";

export type NotificationType = "default" | "error" | "success" | "warn";

interface Notification {
    message: string;
    type: NotificationType;
}

export const notifications = writable<Notification[]>([]);

export function toast(message: string, type: NotificationType = "default") {
    notifications.update((state) => [{ message, type }, ...state]);
    setTimeout(removeToast, 2000);
}

function removeToast() {
    notifications.update((state) => {
        return [...state.slice(0, state.length - 1)];
    });
}
