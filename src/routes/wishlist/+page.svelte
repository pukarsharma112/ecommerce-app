<script>
  import ProductCard from "$lib/components/ProductCard.svelte";

  export let data;
</script>

{#if data.wishlist?.length}
  <div class="px-4 py-2">
    <h1 class="text-4xl">Your wishlist</h1>
  </div>

  <div class="grid grid-cols-1 mb-3 sm:grid-cols-2 xl:grid-cols-3 py-2 md:py-0 md:px-2 gap-2">
    {#each data.wishlist as wishlist (wishlist.product.id)}
      <ProductCard product={wishlist.product} isOnWishList />
    {/each}
  </div>
{:else}
  <div class="px-4 py-5 text-center">
    <h1 class="text-2xl">Nothing on your wishlist</h1>
    <a href="/collections" class="text-primary-500">Shop now</a>
  </div>
{/if}
