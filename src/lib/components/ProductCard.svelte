<script>
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { applyAction, deserialize } from "$app/forms";
  import { updateFlash } from "sveltekit-flash-message/client";

  import { toast } from "$lib/utilities/toast";
  import { activeModal } from "$lib/utilities/stores";
  import WishlistButton from "$lib/components/WishlistButton.svelte";

  export let product;
  export let isOnWishList = false;
  // export let wishlist = new Set();

  const handleWishListSubmit = async (ev) => {
    ev.preventDefault();

    if (!$page.data.currentUser) {
      activeModal.set("/auth/login");
    } else {
      toast.show({ id: "wishlist", type: "loading", message: "Loading..." });

      const response = await fetch(ev.target.action, {
        method: "post",
        body: new FormData(ev.target)
      });

      await updateFlash(page);
      const result = deserialize(await response.text());
      if (result.type === "redirect") await invalidateAll();
    }
  };

  let isModalOpened = false;

  const handlePreview = (ev) => {
    ev.preventDefault();
    isModalOpened = true;
    // history.pushState(undefined, undefined, ev.target.href)
  };
</script>

{#if product}
  <div class="bg-white rounded-xl p-2 shadow-sm">
    <div class="h-90 bg-gray-100 rounded-md group/image overflow-hidden">
      <a href="/products/{product.id}">
        <img
          alt={product.title}
          src={product.images[0]?.url}
          class="h-full w-full object-fit rounded-xl group-hover/image:scale-120 transition-all duration-300" />
      </a>
    </div>
    <div class="px-1 pt-2 overflow-hidden">
      <div class="w-full inline-flex items-center">
        <div class="flex-1">
          <a
            href="/products/{product.id}"
            class="hover:text-primary-500 tracking-tight text-ellipsis">{product.title}</a>
        </div>

        <WishlistButton productId={product.id} {isOnWishList} />
      </div>

      <h2 class="text-xs text-gray-500 font-medium">{product.tags}</h2>

      <div class="inline-flex items-center w-full mt-2">
        <div class="relative inline-flex items-center text-center">
          <strong class="z-1 text-gray-700 text-sm">${product.price}</strong>
        </div>
        <div class="ml-auto inline-flex items-center space-x-1">
          <i class="i-bi-star-fill text-yellow-400 w-3 h-3" />
          <small>{product.ratings}</small>
        </div>
      </div>
    </div>
  </div>
{/if}
