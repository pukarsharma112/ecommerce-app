<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { writable } from "svelte/store";
  import NavLink from "$lib/components/NavLink.svelte";

  import Sorter from "./Sorter.svelte";
  import ProductCard from "$lib/components/ProductCard.svelte";
  import ProductSkeleton from "$lib/components/ProductSkeleton.svelte";

  let ref,
    loading = false;

  export let data;

  $: cursor = writable(data.nextCursor);
  $: products = writable(data.products ?? []);
  $: crumbs = $page.params.category?.split("/");
  $: pageNumber = parseInt($page.url.searchParams.get("page") ?? "1");

  onMount(() => {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && $cursor && !loading) {
          const url = new URL($page.url);

          url.searchParams.set("cursor", $cursor);
          loading = true;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              $cursor = data.nextCursor;

              products.update((p) => {
                return [...p, ...data.products];
              });
            })
            .finally(() => {
              loading = false;
            });
        }
      });
    });

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div
  class="w-full inline-flex items-center space-x-2 text-sm md:text-base py-1 px-4 py-2 rounded-md">
  <a href="/" class="inline-flex items-center space-x-2 hover:text-primary-500">
    <i class="i-heroicons-home" />
    <span>Home</span>
  </a>
  <small>/</small>
  <NavLink
    exact
    href="/categories"
    class="inline-flex items-center space-x-2 hover:text-primary-500"
    activeclass="text-gray-500 pointer-events-none">
    <i class="i-bi-tags" />
    <span>Categories</span>
  </NavLink>

  {#if crumbs}
    {#each crumbs as category, i}
      {@const url = crumbs.slice(0, i + 1).join("/")}
      <small>/</small>
      <NavLink
        exact
        href="/categories/{url}"
        class="inline-flex items-center space-x-2 hover:text-primary-500"
        activeclass="text-gray-500 pointer-events-none">
        <span class="capitalize">{category}</span>
      </NavLink>
    {/each}
  {/if}
</div>

<div class="flex flex-col md:flex-row px-4 md:space-x-2">
  <form>
    <div class="bg-white rounded-md p-1 md:w-70">
      <details class="rounded-md group/filters" open>
        <summary
          class="cursor-pointer text-base uppercase items-center inline-flex w-full rounded-md group-open/filters:text-primary-500 space-x-1">
          <div class="inline-flex items-center w-full bg-gray-100 rounded-md px-2">
            <span>Filters</span>
            <i
              class="i-bi-chevron-down w-3 h-3 ml-auto group-open/filters:rotate-180 transition-all" />
          </div>
          <Sorter />
        </summary>

        <div class="space-y-1 mt-1">
          <details class="bg-gray-100 rounded-md group/categories" open>
            <summary
              class="cursor-pointer px-2 text-base uppercase items-center inline-flex w-full group-open/categories:text-primary-500">
              <span>Categories</span>
              <i
                class="i-bi-chevron-down w-3 h-3 ml-auto group-open/categories:rotate-180 transition-all" />
            </summary>

            <div class="px-2 ml-2 py-2 flex flex-col space-y-1">
              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="categories"
                  id="category-men"
                  value="men"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="category-men" class="text-sm cursor-pointer">Men</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="categories"
                  id="category-women"
                  value="women"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="category-women" class="text-sm cursor-pointer">Women</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="categories"
                  id="category-kids"
                  value="kids"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="category-kids" class="text-sm cursor-pointer">Kids</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="categories"
                  id="category-electronics"
                  value="electronics"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="category-electronics" class="text-sm cursor-pointer">Electronics</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="categories"
                  id="category-household"
                  value="household"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="category-household" class="text-sm cursor-pointer">Household</label>
              </div>
            </div>
          </details>

          <details class="bg-gray-100 rounded-md group/ratings">
            <summary
              class="cursor-pointer px-2 text-base uppercase items-center inline-flex w-full group-open/ratings:text-primary-500">
              <span>RATINGS</span>
              <i
                class="i-bi-chevron-down w-3 h-3 ml-auto group-open/ratings:rotate-180 transition-all" />
            </summary>
            <div class="px-2 ml-2 py-2 flex flex-col space-y-1">
              <div class="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="ratings"
                  id="rating-high"
                  value="high"
                  class=" focus:ring-primary-500 checked:text-primary-500" />
                <label for="rating-high" class="text-sm cursor-pointer">High (4.5+)</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="ratings"
                  id="rating-medium"
                  value="medium"
                  class=" focus:ring-primary-500 checked:text-primary-500" />
                <label for="rating-medium" class="text-sm cursor-pointer">Medium (4+)</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="ratings"
                  id="rating-good"
                  value="good"
                  class=" focus:ring-primary-500 checked:text-primary-500" />
                <label for="rating-good" class="text-sm cursor-pointer">Good (3+)</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="ratings"
                  id="rating-poor"
                  value="poor"
                  class=" focus:ring-primary-500 checked:text-primary-500" />
                <label for="rating-poor" class="text-sm cursor-pointer">Poor(3-)</label>
              </div>
            </div>
          </details>

          <details class="bg-gray-100 rounded-md group/sizes">
            <summary
              class="cursor-pointer px-2 text-base uppercase items-center inline-flex w-full group-open/sizes:text-primary-500">
              <span>PRODUCT SIZE</span>
              <i
                class="i-bi-chevron-down w-3 h-3 ml-auto group-open/sizes:rotate-180 transition-all" />
            </summary>
            <div class="px-2 ml-2 py-2 flex flex-col space-y-1">
              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="size"
                  id="size-small"
                  value="S"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="size-small" class="text-sm cursor-pointer">S</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="size"
                  id="size-medium"
                  value="M"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="size-medium" class="text-sm cursor-pointer">M</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="size"
                  id="size-large"
                  value="L"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="size-large" class="text-sm cursor-pointer">L</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="size"
                  id="size-xl"
                  value="XL"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="size-xl" class="text-sm cursor-pointer">XL</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="size"
                  id="size-xxl"
                  value="XXL"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="size-xxl" class="text-sm cursor-pointer">XXL</label>
              </div>

              <div class="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="size"
                  id="size-xxxl"
                  value="XXXL"
                  class="rounded-md focus:ring-primary-500 checked:text-primary-500" />
                <label for="size-xxxl" class="text-sm cursor-pointer">XXXL</label>
              </div>
            </div>
          </details>

          <details class="bg-gray-100 rounded-md group/colors" open>
            <summary
              class="cursor-pointer px-2 text-base uppercase items-center inline-flex w-full group-open/colors:text-primary-500">
              <span>PRODUCT COLORS</span>
              <i
                class="i-bi-chevron-down w-3 h-3 ml-auto group-open/colors:rotate-180 transition-all" />
            </summary>
            <div class="px-2 ml-2 py-2">
              <input
                title="black"
                value="black"
                name="colors"
                type="checkbox"
                class="rounded-full w-6 h-6 bg-black border-0 checked:text-black focus:border-black focus:ring-primary-500 !checked:ring-primary-500 checked:ring-2 checked:ring-offset-2 shadow-sm m-1"
                id="colors-black" />

              <input
                title="white"
                value="white"
                name="colors"
                type="checkbox"
                class="rounded-full w-6 h-6 bg-gray-50 checked:text-gray-200 !focus:border-gray-500 focus:ring-primary-500 !checked:ring-primary-500 checked:ring-2 checked:ring-offset-2 checked:border-gray-500 shadow-sm m-1"
                id="colors-white" />

              <input
                title="gray"
                value="gray"
                name="colors"
                type="checkbox"
                class="rounded-full w-6 h-6 bg-gray-500 border-0 checked:text-gray-500 focus:ring-primary-500 !checked:ring-primary-500 checked:ring-2 checked:ring-offset-2 shadow-sm m-1"
                id="colors-gray" />

              <input
                value="red"
                name="colors"
                type="checkbox"
                class="rounded-full w-6 h-6 bg-red-500 border-0 checked:text-red-500 focus:ring-primary-500 !checked:ring-primary-500 checked:ring-2 checked:ring-offset-2 shadow-sm m-1"
                id="colors-red" />

              <input
                value="blue"
                title="blue"
                name="colors"
                type="checkbox"
                class="rounded-full w-6 h-6 bg-blue-500 border-0 checked:text-blue-500 focus:ring-primary-500 !checked:ring-primary-500 checked:ring-2 checked:ring-offset-2 shadow-sm m-1"
                id="colors-blue" />

              <input
                value="green"
                name="colors"
                type="checkbox"
                class="rounded-full w-6 h-6 bg-green-500 border-0 checked:text-green-500 focus:ring-primary-500 !checked:ring-primary-500 checked:ring-2 checked:ring-offset-2 shadow-sm m-1"
                id="colors-green" />

              <input
                title="purple"
                value="purple"
                name="colors"
                type="checkbox"
                class="rounded-full w-6 h-6 bg-purple-500 border-0 checked:text-purple-500 focus:ring-primary-500 !checked:ring-primary-500 checked:ring-2 checked:ring-offset-2 shadow-sm m-1"
                id="colors-purple" />

              <input
                title="pink"
                value="pink"
                name="colors"
                type="checkbox"
                class="rounded-full w-6 h-6 bg-pink-500 border-0 checked:text-pink-500 focus:ring-primary-500 !checked:ring-primary-500 checked:ring-2 checked:ring-offset-2 shadow-sm m-1"
                id="colors-pink" />
            </div>
          </details>

          <details class="bg-gray-100 rounded-md group/price">
            <summary
              class="cursor-pointer px-2 text-base uppercase items-center inline-flex w-full group-open/price:text-primary-500">
              <span>PRICE</span>
              <i
                class="i-bi-chevron-down w-3 h-3 ml-auto group-open/price:rotate-180 transition-all" />
            </summary>

            <div class="px-2 ml-2 py-2 flex flex-col space-y-1">
              <div class="inline-flex items-center w-full">
                <label for="min-price" class="cursor-pointer text-sm">Min</label>
                <input
                  type="number"
                  id="min-price"
                  class="border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 ml-auto max-w-25 rounded-md text-sm py-1 px-2" />
              </div>

              <div class="inline-flex items-center w-full border-t pt-1 border-white">
                <label for="max-price" class="cursor-pointer text-sm">Max</label>
                <input
                  type="number"
                  id="max-price"
                  class="border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 ml-auto max-w-25 rounded-md text-sm py-1 px-2" />
              </div>
            </div>
          </details>

          <button
            class="block w-full rounded-md text-sm font-medium bg-primary-500 text-white py-2 active:bg-primary-600"
            >Apply filter</button>
        </div>
      </details>
    </div>
  </form>

  <div class="flex-1">
    {#if $products.length}
      <div class="grid grid-cols-1 mb-3 sm:grid-cols-2 xl:grid-cols-3 py-2 md:py-0 md:px-2 gap-2">
        {#each $products as product (product.id)}
          <ProductCard {product} isOnWishList={data.userWishList.has(product.id)} />
        {/each}
        {#if loading}
          {#each Array(7) as _, i}
            <ProductSkeleton />
          {/each}
        {/if}
      </div>
    {:else}
      <div class="flex h-full items-center justify-center">
        <div class="text-center">
          <h1 class="m-auto text-lg text-gray-700">No products found to show</h1>
          <a href="/collections" class="text-primary-500 hover:underline">Show all</a>
        </div>
      </div>
    {/if}

    <div class="text-center" bind:this={ref}>
      {#if loading}
        <div class="py-3">
          <i class="i-svg-spinners:ring-resize mx-auto w-15 h-15" />
        </div>
      {/if}
    </div>
  </div>
</div>

{#if import.meta.env.SSR && $products.length}
  <div class="inline-flex items-center w-full items-center justify-end px-4 py-3 space-x-2">
    <form>
      <input type="hidden" name="page" value={pageNumber - 1} />
      <button
        disabled={pageNumber < 2}
        class="ml-auto py-2 px-3 bg-white text-sm font-medium text-primary-500 rounded-md shadow-sm disabled:cursor-not-allowed disabled:text-gray-500"
        >Previous</button>
    </form>

    <form>
      <input type="hidden" name="page" value={pageNumber + 1} />
      <button
        disabled={!data.nextCursor}
        class="ml-auto py-2 px-3 bg-white text-sm font-medium text-primary-500 rounded-md shadow-sm disabled:cursor-not-allowed disabled:text-gray-500"
        >Next</button>
    </form>
  </div>
{/if}
