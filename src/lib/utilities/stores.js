import { writable } from "svelte/store";

export const referer = writable("/");
export const activeModal = writable(undefined);
