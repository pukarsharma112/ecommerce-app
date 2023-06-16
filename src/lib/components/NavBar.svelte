<script>
  import { clsx } from "clsx";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";

  import { toast } from "$lib/utilities/toast";
  import { clickAway } from "$lib/utilities/actions";
  import { referer, activeModal } from "$lib/utilities/stores";

  let isSearchBarOpened = $page.url.searchParams.has("query");

  const handleModalLink = (ev) => {
    const url = new URL(ev.target.href);
    if ($page.url.toString() === url.toString()) return;

    ev.preventDefault();

    if (!$page.data.currentUser) {
      if (!url.pathname.startsWith("/auth")) {
        $activeModal = "/auth/login";

        toast.show({
          id: "auth",
          type: "error",
          message: "Please login to your account to continue."
        });

        if ($page.url.pathname.startsWith("/auth")) {
          $activeModal = undefined;
        }
      } else {
        $activeModal = url.pathname;
      }
    } else {
      $activeModal = url.pathname;
    }

    history.pushState(undefined, undefined, $activeModal);
  };

  const closeModal = () => {
    $activeModal = undefined;
    history.pushState(undefined, undefined, $page.url);
  };

  const loadCartData = async () => {
    const response = await fetch("/cart", {
      headers: { Accept: "application/json", "Content-Type": "application/json" }
    });

    const json = await response.json();
    return json?.userCart;
  };
</script>

<nav class="inline-flex items-center w-full bg-white shadow-sm px-4 md:px-8 relative py-1.5">
  <a href="/">
    <img src="/app-logo.svg" alt="Brand logo" class="w-10 h-10" />
  </a>

  <div class="hidden sm:inline-flex flex-1 ml-4">
    <a
      class="h-full hover:bg-gray-100 hover:text-primary-500 inline-flex rounded-lg px-3 py-1.5 sm:text-sm md:text-base"
      href="/collections/men">Men</a>
    <a
      class="h-full hover:bg-gray-100 hover:text-primary-500 inline-flex rounded-lg px-3 py-1.5 sm:text-sm md:text-base"
      href="/collections/women">Women</a>
    <a
      class="h-full hover:bg-gray-100 hover:text-primary-500 inline-flex rounded-lg px-3 py-1.5 sm:text-sm md:text-base"
      href="/collections/kids">Kids</a>
    <a
      class="h-full hover:bg-gray-100 hover:text-primary-500 inline-flex rounded-lg px-3 py-1.5 sm:text-sm md:text-base"
      href="/collections/">Shop</a>
  </div>

  <div class="ml-auto inline-flex items-center">
    <form
      action="/collections"
      class={clsx("md:inline-flex absolute w-full h-full left-0 bg-white z-10 md:relative mr-3", {
        hidden: !isSearchBarOpened,
        "inline-flex": isSearchBarOpened
      })}
      autocomplete="off">
      <a
        href={$referer}
        class="inline-flex items-center pl-2 md:hidden"
        on:click|preventDefault={() => {
          isSearchBarOpened = false;
        }}>
        <i class="i-heroicons-chevron-left w-6 h-6" />
      </a>

      <div class="relative group w-full">
        <input
          name="query"
          type="search"
          class="text-base rounded-lg border-0 bg-transparent w-full h-full md:bg-gray-200/40 outline-none focus:ring-0 md:focus:ring-2 md:focus:ring-primary-500 transition-all"
          placeholder="Search for the products" />
        <button
          class="inline-flex items-center absolute right-0 h-full bg-transparent pr-2 group-focus-within:text-primary-500 hover:text-primary-500 text-gray-600">
          <i class="i-heroicons-magnifying-glass w-5 h-5 <md:hidden" />
          <span class="text-sm font-medium md:hidden">Search</span>
        </button>
      </div>
    </form>

    <a
      href="/search?query="
      class="md:hidden relative text-gray-600 font-medium text-center px-2 hover:text-black ml-3"
      on:click|preventDefault={() => {
        isSearchBarOpened = true;
      }}>
      <i class="i-heroicons-magnifying-glass w-7 h-7" />
      <small class="<sm:hidden text-xs block pointer-events-none">Search</small>
    </a>

    <div class="contents">
      <a
        href="/cart"
        on:click={handleModalLink}
        class="relative text-gray-600 font-medium text-center px-2 hover:text-black ml-3 hover:text-primary-500">
        {#if $page.data.cartCount}
          <div class="fixed top-1 ml-8 text-xs rounded-lg z-1 font-bold">
            {$page.data.cartCount}
          </div>
        {/if}
        <i
          class={clsx("w-7 h-7", {
            "i-heroicons-shopping-cart": $page.data.cartCount,
            "i-bi-cart-x ": !$page.data.cartCount
          })} />
        <small class="<sm:hidden text-xs block pointer-events-none">Cart</small>
      </a>

      <!-- cart dropdown -->
      {#if $activeModal === "/cart"}
        <div
          class="fixed px-3 pb-5 top-2 sm:top-10 right-0 sm:right-18 w-full h-full sm:w-lg md:w-auto sm:h-auto z-10"
          use:clickAway={closeModal}>
          <div
            class="bg-white border rounded-lg py-2 shadow w-full h-full sm:min-w-md flex flex-col sm:max-h-xl">
            <div class="px-3 inline-flex items-center w-full border-b pb-2">
              <h1 class="text-base font-medium text-gray-900">Your cart</h1>
              <button
                on:click={closeModal}
                class="bg-transparent ml-auto text-black focus:ring-2 focus:ring-red-500 rounded-md">
                <i class="i-heroicons-x-mark h-5 w-5" />
              </button>
            </div>
            {#if $page.data.cartCount}
              {#await loadCartData()}
                <h1 class="mx-3 mt-2">Loading...</h1>
              {:then d}
                {#await import("$lib/components/Cart.svelte")}
                  <h1 class="mx-3 mt-2">Loading...</h1>
                {:then m}
                  <svelte:component this={m.default} userCart={d} isModalView />
                  <div class="px-2 pt-2">
                    <a
                      href="/cart"
                      on:click={closeModal}
                      class="flex items-center justify-center rounded-md border border-transparent bg-primary-500 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-600">
                      Checkout
                    </a>
                  </div>
                {/await}
              {/await}
            {:else}
              <h1 class="mx-3 mt-2">Your cart is empty!</h1>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- user's profile link -->
    <div class="contents">
      <a
        on:click={handleModalLink}
        href={$page.data.currentUser ? "/profile" : "/auth/login"}
        class="text-gray-600 font-medium text-center px-2 hover:text-black ml-3 hover:text-primary-500 group">
        {#if $page.data.currentUser}
          <img
            alt=""
            src={$page.data.currentUser.avatar}
            class="w-8.5 h-8.5 rounded-full mx-auto group-focus:ring-2 group-focus:ring-primary-500 pointer-events-none" />
          <small class="<sm:hidden text-xs block pointer-events-none"> Profile </small>
        {:else}
          <i class="i-heroicons-user-circle w-7 h-7" />
          <small class="<sm:hidden text-xs block pointer-events-none"> Login </small>
        {/if}
      </a>

      <!-- profile dropdown -->
      {#if $activeModal === "/profile" && $page.data.currentUser}
        <div
          class="absolute right-7 top-10 bg-white border min-w-50 rounded-lg border shadow-sm z-10"
          use:clickAway={closeModal}>
          <div class="inline-flex w-full border-b p-2 text-sm inline-flex items-center">
            <img alt="" src={$page.data.currentUser.avatar} class="w-8 h-8 rounded-full mr-3" />
            <span>{$page.data.currentUser.name}</span>
          </div>
          <div class="p-1 flex flex-col relative space-y-0.5">
            <a
              href="/cart"
              on:click={closeModal}
              class="group text-sm hover:bg-gray-100 hover:text-primary-500 w-full rounded-md px-2 py-1 inline-flex items-center">
              <i class="i-heroicons-shopping-cart w-5 h-5 mr-3" />
              <span>Cart</span>
              <div
                class="ml-auto text-xs bg-gray-100 group-hover:bg-gray-200 text-black font-bold px-3 py-0 rounded-lg">
                {$page.data.cartCount}
              </div>
            </a>

            <a
              href="/wishlist"
              on:click={closeModal}
              class="text-sm hover:bg-gray-100 hover:text-primary-500 w-full rounded-md px-2 py-1 inline-flex items-center">
              <i class="i-heroicons-heart w-5 h-5 mr-3" />
              <span>Wishlist</span>
            </a>

            <a
              href="/invoices"
              on:click={closeModal}
              class="text-sm hover:bg-gray-100 hover:text-primary-500 w-full rounded-md px-2 py-1 inline-flex items-center">
              <i class="i-bi-journal-bookmark w-4 h-4 mr-3" />
              <span>Invoices</span>
            </a>

            <a
              href="/profile"
              on:click={closeModal}
              class="text-sm hover:bg-gray-100 hover:text-primary-500 w-full rounded-md px-2 py-1 inline-flex items-center">
              <i class="i-heroicons-user-circle w-5 h-5 mr-3" />
              <span>Profile</span>
            </a>

            <div class="w-full h-1 bg-gray-100 rounded-md" />

            <form
              method="post"
              action="/auth/logout"
              use:enhance={() => {
                closeModal();
                toast.show({ id: "auth", type: "loading", message: "Please wait..." });
              }}>
              <button
                type="submit"
                class="text-sm bg-transparent hover:bg-red-50 hover:text-red-500 w-full rounded-md px-2 py-1 inline-flex items-center">
                <i class="i-heroicons-arrow-left-on-rectangle w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      {/if}
    </div>
  </div>
</nav>

{#if $activeModal === "/auth/register" || $activeModal === "/auth/login"}
  <div
    class="p-2 fixed left-0 top-0 z-100 w-full h-full flex overflow-auto"
    transition:fade={{ duration: 100 }}>
    <div class="z-15 fixed inset-0 bg-black/5" on:click={closeModal} on:keyup />
    <div class="relative bg-white w-md min-h-lg m-auto z-100 rounded-lg shadow">
      <button
        class="right-2 top-2 absolute rounded-md w-6 h-6 bg-red-50 text-red-500 focus:ring-2 focus:ring-red-500"
        on:click={closeModal}>
        <i class="i-heroicons-x-mark w-6 h-6" />
      </button>

      <div class="-mt-8 w-full flex">
        {#if $activeModal === "/auth/login"}
          {#await import("../../routes/auth/login/+page.svelte") then m}
            <svelte:component
              this={m.default}
              onSuccess={closeModal}
              onNavigate={handleModalLink} />
          {/await}
        {:else}
          {#await import("../../routes/auth/register/+page.svelte") then m}
            <svelte:component
              this={m.default}
              onSuccess={closeModal}
              onNavigate={handleModalLink} />
          {/await}
        {/if}
      </div>
    </div>
  </div>
{/if}
