<script>
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { applyAction, deserialize } from "$app/forms";
  import { updateFlash } from "sveltekit-flash-message/client";

  import { toast } from "$lib/utilities/toast";
  import { activeModal } from "$lib/utilities/stores";

  export let productId;
  export let isOnWishList = false;

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
</script>

{#if isOnWishList}
  <form
    method="post"
    action="/wishlist?/removeFromList"
    class="inline-flex ml-auto"
    on:submit={handleWishListSubmit}>
    <input type="hidden" name="productId" value={productId} />
    <button
      type="submit"
      formaction="/wishlist?/removeFromList"
      class="ml-auto bg-transparent inline-flex items-center justify-center focus:scale-110 transition-all">
      <i class="i-bi-heart-fill w-5 h-5 text-red-500" />
    </button>
  </form>
{:else}
  <form
    method="post"
    action="/wishlist?/addToList"
    class="inline-flex ml-auto"
    on:submit={handleWishListSubmit}>
    <input type="hidden" name="productId" value={productId} />
    <button
      type="submit"
      formaction="/wishlist?/addToList"
      class="ml-auto bg-transparent inline-flex items-center justify-center hover:text-red-500 focus:scale-110 transition-all">
      <i class="i-bi-heart w-5 h-5" />
    </button>
  </form>
{/if}
