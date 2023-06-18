<script>
  import { clsx } from "clsx";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { updateFlash } from "sveltekit-flash-message/client";

  import { toast } from "$lib/utilities/toast";
  import { referer } from "$lib/utilities/stores";
  import WishlistButton from "$lib/components/WishlistButton.svelte";

  export let data;
  let previewId = 0;
</script>

<svelte:head>
  <title>{data.product.title}</title>
</svelte:head>

<div class="bg-white">
  <div class="px-4 pt-2">
    <a href={$referer} class="text-primary-500 hover:underline inline-flex items-center">
      <i class="i-heroicons-chevron-left w-5 h-5 mr-1" />
      <span>Back</span>
    </a>
  </div>
  <div class="p-8 lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
    <!-- Product image -->
    <div class="lg:col-span-4 lg:row-end-1 flex flex-col-reverse">
      <!-- Image selector -->
      <div class="space-x-6 py-4 inline-flex w-full items-center overflow-auto px-1">
        <!-- Selected: ring-3 ring-primary-500 -->

        {#if data.product?.images}
          {#each data.product.images as image, i (image.id)}
            <button
              class={clsx(
                "relative flex min-w-24 h-24 cursor-pointer items-center justify-center bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none p-2 rounded-lg focus:ring-3 focus:ring-opacity-50 focus:ring-primary-300 focus:border-primary-500 focus:border-2",
                {
                  "ring-3 ring-primary-500": i === previewId
                }
              )}
              on:click={() => {
                previewId = i;
              }}
              type="button">
              <div class="absolute inset-0 overflow-hidden rounded-lg">
                <img
                  alt={data.product.title}
                  src={image.url}
                  class="h-full w-full object-cover object-center" />
              </div>
            </button>
          {/each}
        {/if}
      </div>

      <!-- image preview -->
      <div class="aspect-w-1 aspect-h-1 rounded-lg">
        <!-- Tab panel, show/hide based on tab state. -->
        {#if data.product?.images[previewId]}
          <img
            alt={data.product.title}
            src={data.product.images[previewId].url}
            class="h-full w-full object-cover object-center sm:rounded-lg" />
        {/if}
      </div>
    </div>

    <div class="max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
      <!-- title -->

      <div class="mt-4">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {data.product.title}
        </h1>
      </div>

      <section aria-labelledby="information-heading" class="mt-4">
        <h2 id="information-heading" class="sr-only">Product information</h2>

        <div class="flex items-center">
          <p class="text-lg text-gray-900 sm:text-xl">${data.product.price}</p>

          <div class="ml-4 border-l border-gray-300 pl-4">
            <h2 class="sr-only">Reviews</h2>
            <div class="flex items-center">
              <p class="text-sm text-gray-700">{data.product.ratings}</p>
              <div class="ml-2 flex items-center space-x-0.5">
                {#if data.product.ratings > 1}
                  <i class="i-bi-star-fill bg-primary-500" />
                {:else}
                  <i class="i-bi-star bg-primary-500" />
                {/if}

                {#if data.product.ratings > 2}
                  <i class="i-bi-star-fill bg-primary-500" />
                {:else}
                  <i class="i-bi-star bg-primary-500" />
                {/if}

                {#if data.product.ratings > 3}
                  <i class="i-bi-star-fill bg-primary-500" />
                {:else}
                  <i class="i-bi-star bg-primary-500" />
                {/if}

                {#if data.product.ratings > 4}
                  <i class="i-bi-star-fill bg-primary-500" />
                {:else}
                  <i class="i-bi-star bg-primary-500" />
                {/if}

                {#if data.product.ratings >= 5}
                  <i class="i-bi-star-fill bg-primary-500" />
                {:else}
                  <i class="i-bi-star bg-primary-500" />
                {/if}
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 space-y-6">
          <p class="text-base text-gray-500">
            {@html data.product.description}
          </p>
        </div>

        <div class="mt-6 flex items-center">
          {#if data.product.quantity > 0}
            <i class="i-heroicons-check w-5 h-5 text-green-500" />
            <p class="ml-2 text-sm text-gray-500">
              {data.product.quantity} items in stock and ready to ship
            </p>
          {:else}
            <i class="i-heroicons-x-mark w-5 h-5 text-red-500" />
            <p class="ml-2 text-sm text-gray-500">Out of stock</p>
          {/if}
        </div>
      </section>

      <form
        method="post"
        action="/cart?/addToCart"
        class="mt-6"
        use:enhance={() => {
          toast.show({ id: "cart", type: "loading", message: "Loading..." });
          return ({ update }) => {
            updateFlash(page);
            invalidateAll();
          };
        }}>
        <input type="hidden" name="productId" value={data.product.id} />
        <!-- Colors -->
        {#if data?.product?.colors?.length}
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-3">Color</h3>
              {#each data.product.colors as c}
              <input
                title={c.color}
                value={c.color}
                name="colors"
                type="checkbox"
                class="cursor-pointer rounded-full w-8 h-8 border-0 focus:ring-0 !checked:ring-2 !checked:ring-primary-500 !checked:ring-offset-2 shadow-sm mx-1.5"
                style:background-color={c.hex}
                id="colors-black" />
              {/each}

          </div>
        {/if}

        <!-- Sizes -->

        {#if data.product?.sizes}
          <div class="mt-10">
            <h3 class="text-sm font-medium text-gray-900">Size</h3>

            <div class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4 mt-4">
              {#each data.product.sizes as size (size.id)}
                <label
                  class={clsx(
                    "group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6",
                    {
                      "bg-gray-50 text-gray-200 cursor-not-allowed border-2":
                        size.available == false || !data.product.quantity,
                      "cursor-pointer": size.available !== false
                    }
                  )}>
                  <input
                    type="checkbox"
                    value={size.size}
                    name="size-choice"
                    class="sr-only peer"
                    disabled={size.available === false} />
                  <span id="size-{size.size}">{size.size}</span>

                  {#if size.available === false || !data.product.quantity}
                    <span
                      aria-hidden="true"
                      class="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                      <svg
                        class="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        stroke="currentColor">
                        <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
                      </svg>
                    </span>
                  {/if}
                </label>
              {/each}
            </div>
          </div>
        {/if}

        <div class="flex items-center mt-10 space-x-2 w-full sm:w-sm">
          {#if data.isOnCart}
            <div>
              <button
                type="submit"
                formaction="/cart?/removeFromCart"
                class="w-full rounded-md border border-transparent bg-red-600 py-2 px-8 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >Remove from cart</button>
            </div>
          {:else if data.product.quantity}
            <!-- <input
              name="quantity"
              id="quantity"
              type="number"
              class="w-15 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500"
              value="1"
              max={data.product.quantity} /> -->

            <button
              type="submit"
              formaction="/cart?/addToCart"
              class="w-full rounded-md border border-transparent bg-primary-600 py-2 px-8 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >Add to cart</button>
          {:else}
            <button
              disabled
              type="button"
              class="w-full rounded-md border border-transparent bg-gray-600 py-2 px-8 text-base font-medium text-white hover:bg-gray-700 cursor-not-allowed"
              >Out of stock</button>
          {/if}

          <div class="inline-flex items-center px-3">
            <WishlistButton productId={data.product.id} isOnWishList={data.isOnWishList} />
          </div>
        </div>

        {#if data.product.quantity}
          <div class="mt-5">
            <a
              href="/products/{data.product.id}/checkout"
              class="block w-full bg-gray-100 py-3 rounded-lg text-center text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >Order now</a>
          </div>
        {/if}
      </form>

      <div class="mt-10 border-t border-gray-200 pt-10">
        <h3 class="text-sm font-medium text-gray-900">Highlights</h3>
        <div class="prose prose-sm mt-4 text-gray-500">
          <ul>
            <li>200+ SVG icons in 3 unique styles</li>

            <li>Compatible with Figma, Sketch, and Adobe XD</li>

            <li>Drawn on 24 x 24 pixel grid</li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-gray-200 pt-10">
        <h3 class="text-sm font-medium text-gray-900">Share</h3>
        <ul class="mt-4 flex items-center space-x-6">
          <li>
            <span
              class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer">
              <span class="sr-only">Share on Facebook</span>
              <i class="i-bi-facebook w-6 h-6" />
            </span>
          </li>
          <li>
            <span
              class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer">
              <span class="sr-only">Share on Instagram</span>
              <i class="i-bi-instagram w-6 h-6" />
            </span>
          </li>
          <li>
            <span
              class="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer">
              <span class="sr-only">Share on Twitter</span>
              <i class="i-bi-twitter w-6 h-6" />
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
      <div>
        <div class="border-b border-gray-200">
          <div class="-mb-px flex space-x-8" aria-orientation="horizontal">
            <!-- Selected: "border-primary-600 text-primary-600", Not Selected: "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300" -->
            <button
              class="border-transparent bg-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300 whitespace-nowrap border-b-2 py-6 text-sm font-medium"
              type="button">Customer Reviews</button>
            <button
              id="tab-faq"
              class="border-transparent bg-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300 whitespace-nowrap border-b-2 py-6 text-sm font-medium"
              type="button">FAQ</button>
            <button
              id="tab-license"
              class="border-transparent bg-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300 whitespace-nowrap border-b-2 py-6 text-sm font-medium"
              type="button">License</button>
          </div>
        </div>

        <!-- 'Customer Reviews' panel, show/hide based on tab state -->
        <div id="reviews">
          <h3 class="sr-only">Customer Reviews</h3>

          <div class="flex space-x-4 text-sm text-gray-500" />

          <div class="flex space-x-4 text-sm text-gray-500" />

          <!-- More reviews... -->
        </div>
        {#if $page.data.currentUser}
          <div class="py-4 border-t mt-4 ml-10 space-y-2">
            <div class="inline-flex items-center w-full space-x-3">
              <img
                alt=""
                src={$page.data.currentUser.avatar}
                class="h-12 w-12 rounded-full p-0 ring-2.5 ring-primary-500" />
              <textarea class="w-full rounded-lg border border-gray-300 shadow-sm" />
            </div>
            <div class="ml-14 flex flex-col space-y-3">
              <div class="inline-flex space-x-1">
                <i
                  class="i-bi-star w-6 h-6 cursor-pointer hover:bg-primary-500 hover:text-primary-600" />
                <i
                  class="i-bi-star w-6 h-6 cursor-pointer hover:bg-primary-500 hover:text-primary-600" />
                <i
                  class="i-bi-star w-6 h-6 cursor-pointer hover:bg-primary-500 hover:text-primary-600" />
                <i
                  class="i-bi-star w-6 h-6 cursor-pointer hover:bg-primary-500 hover:text-primary-600" />
                <i
                  class="i-bi-star w-6 h-6 cursor-pointer hover:bg-primary-500 hover:text-primary-600" />
              </div>

              <button
                class="bg-primary-500 text-sm font-medium text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >Add review</button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
