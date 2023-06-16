import { writable } from "svelte/store";

export const timeouts = new Map();
export const toasts = writable([]);

const getDefaultOptions = () => ({
  timeout: 4000,
  id: Date.now(),
  dismissable: true,
  createdAt: Date.now(),
  position: "bottom-right"
});

export const toast = {
  show(t) {
    const newToast = { ...getDefaultOptions(), ...t };
    if (newToast.type === "loading") {
      newToast.timeout = Infinity;
    }

    clearTimeout(timeouts.get(newToast.id));
    toasts.update(($toasts) => {
      const filtered = $toasts.filter((t) => t.id !== newToast.id);
      return [newToast, ...filtered];
    });

    if (newToast.timeout !== Infinity) {
      const timeoutId = setTimeout(() => toast.remove(newToast.id), newToast.timeout);
      timeouts.set(newToast.id, timeoutId);
    }

    return newToast.id;
  },
  remove(id) {
    toasts.update(($toasts) => $toasts.filter((t) => t.id !== id));
    clearTimeout(timeouts.get(id));
    timeouts.delete(id);
  },
  removeAll() {
    for (const id of timeouts.values()) clearTimeout(id);
    timeouts.clear();
    toasts.set([]);
  }
};
