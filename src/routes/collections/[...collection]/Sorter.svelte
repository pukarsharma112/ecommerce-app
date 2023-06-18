<script>
  import { clsx } from "clsx";
  import { page } from "$app/stores";

  let sorting = $page.url.searchParams.get("sorting") ?? "newest-first";
</script>

<div class="group/sortings <md:-mt-0.5">
  <input type="hidden" name="query" value={$page.url.searchParams.get("query")} />
  <button
    type="button"
    class=" rounded-md font-medium text-xs md:text-sm pl-2 pr-1 py-1 md:py-0.5 bg-gray-100 inline-flex items-center">
    <span>Sort</span>
    <i
      class="i-heroicons-chevron-down ml-2 group-focus-within/sortings:-rotate-90 transition-all duration-300" />
  </button>
  <div
    class="hidden group-focus-within/sortings:flex absolute <md:right-4 bg-white border rounded-md shadow p-1 flex-col space-y-1 z-10"
    tabindex={0}>
    <div
      class={clsx("inline-flex items-center pl-2 pr-6 hover:bg-gray-100 rounded-md text-base", {
        "bg-gray-100 text-primary-500": sorting === "newest-first"
      })}>
      <input
        bind:group={sorting}
        type="radio"
        id="newest-first"
        name="sorting"
        value="newest-first"
        class="mr-2 checked:bg-primary-500 focus:ring-primary-500 w-3 h-3 text-primary-500" />
      <label for="newest-first" class="cursor-pointer w-full text-black text-sm"
        >Newest First</label>
    </div>

    <div
      class={clsx("inline-flex items-center pl-2 pr-6 hover:bg-gray-100 rounded-md text-base", {
        "bg-gray-100 text-primary-500": sorting === "most-popular"
      })}>
      <input
        bind:group={sorting}
        type="radio"
        id="most-popular"
        name="sorting"
        value="most-popular"
        class="mr-2 checked:bg-primary-500 focus:ring-primary-500 w-3 h-3 text-primary-500" />
      <label for="most-popular" class="cursor-pointer w-full text-black text-sm"
        >Most Popular</label>
    </div>

    <div
      class={clsx("inline-flex items-center pl-2 pr-6 hover:bg-gray-100 rounded-md text-base", {
        "bg-gray-100 text-primary-500": sorting === "ratings-asc"
      })}>
      <input
        bind:group={sorting}
        type="radio"
        id="ratings-asc"
        name="sorting"
        value="ratings-asc"
        class="mr-2 checked:bg-primary-500 focus:ring-primary-500 w-3 h-3 text-primary-500" />
      <label for="ratings-asc" class="cursor-pointer w-full text-black text-sm"
        >Ratings: Low to high</label>
    </div>

    <div
      class={clsx("inline-flex items-center pl-2 pr-6 hover:bg-gray-100 rounded-md text-base", {
        "bg-gray-100 text-primary-500": sorting === "ratings-desc"
      })}>
      <input
        bind:group={sorting}
        type="radio"
        id="ratings-desc"
        name="sorting"
        value="ratings-desc"
        class="mr-2 checked:bg-primary-500 focus:ring-primary-500 w-3 h-3 text-primary-500" />
      <label for="ratings-desc" class="cursor-pointer w-full text-black text-sm"
        >Ratings: High to low</label>
    </div>

    <div
      class={clsx("inline-flex items-center pl-2 pr-6 hover:bg-gray-100 rounded-md text-base", {
        "bg-gray-100 text-primary-500": sorting === "price-asc"
      })}>
      <input
        bind:group={sorting}
        type="radio"
        id="price-asc"
        name="sorting"
        value="price-asc"
        class="mr-2 checked:bg-primary-500 focus:ring-primary-500 w-3 h-3 text-primary-500" />
      <label for="price-asc" class="cursor-pointer w-full text-black text-sm"
        >Price: Low to High</label>
    </div>

    <div
      class={clsx("inline-flex items-center pl-2 pr-6 hover:bg-gray-100 rounded-md text-base", {
        "bg-gray-100 text-primary-500": sorting === "price-desc"
      })}>
      <input
        bind:group={sorting}
        type="radio"
        id="price-desc"
        name="sorting"
        value="price-desc"
        class="mr-2 checked:bg-primary-500 focus:ring-primary-500 w-3 h-3 text-primary-500" />
      <label for="price-desc" class="cursor-pointer w-full text-black text-sm"
        >Price: High to Low</label>
    </div>

    <button type="submit" class="text-sm rounded-md font-medium">Apply</button>
  </div>
</div>
