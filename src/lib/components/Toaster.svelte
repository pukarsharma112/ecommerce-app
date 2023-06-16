<script>
  import { clsx } from "clsx";
  import { scale } from "svelte/transition";
  import { toasts, toast, timeouts } from "$lib/utilities/toast";
</script>

<div
  class="fixed bottom-1 inset-x-0 w-full z-100 flex flex-col-reverse px-2 select-none pointer-events-none">
  {#each $toasts as t (t.id)}
    <div
      class="mx-auto bg-white border border-t-gray-200 shadow-lg rounded-lg px-4 py-2 flex items-center break-all my-1 pointer-events-auto dark:bg-black dark:text-white dark:border-gray-700/80"
      transition:scale={{ duration: 400 }}>
      {#if t.type !== "custom"}
        <i
          class={clsx("w-5 h-5 mr-2.5", {
            "i-svg-spinners:ring-resize": t.type === "loading",
            "i-bi-x-circle-fill text-red-500": t.type === "error",
            "i-bi-info-circle-fill text-blue-500": t.type === "info",
            "i-bi-check-circle-fill text-green-500": t.type === "success",
            "i-bi-exclamation-circle-fill text-orange-500": t.type === "warning"
          })} />
      {/if}

      <div class="sm:max-w-sm tracking-tight text-gray-700 dark:text-gray-200 dark:font-medium">
        {#if "component" in t}
          <svelte:component this={t.component} {...t.props} />
        {:else if "html" in t}
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html t.html}
        {:else}
          {t.message}
        {/if}
      </div>
    </div>
  {/each}
</div>
