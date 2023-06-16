<script>
  import "../app.css";
  import "virtual:uno.css";

  import nProgress from "nprogress";
  import { onMount, setContext } from "svelte";
  import { page, navigating } from "$app/stores";
  import { afterNavigate } from "$app/navigation";

  import { initFlash } from "sveltekit-flash-message/client";

  import { toast } from "$lib/utilities/toast";
  import { referer } from "$lib/utilities/stores";
  import NavBar from "$lib/components/NavBar.svelte";
  import Toaster from "$lib/components/Toaster.svelte";

  export let data;

  const flash = initFlash(page);

  $: if ($flash) toast.show($flash);
  $: $navigating ? nProgress.start() : nProgress.done();

  afterNavigate(({ from, to }) => {
    // for previous url and clearing flash message

    if (from?.url && from.url.pathname !== to?.url.pathname) {
      data.referer = from.url.href;
      referer.set(from.url.href);
      $flash = undefined;
    }
  });
</script>

<div class="flex flex-col overflow-hidden h-full w-full">
  <header>
    <!-- for notices of events -->
    <div class="bg-black text-center text-sm md:text-base tracking-tight text-gray-200" />

    <!-- navbar -->
    <NavBar />
  </header>

  <div class="flex-1 overflow-auto">
    <slot />
    <Toaster />
  </div>
</div>
