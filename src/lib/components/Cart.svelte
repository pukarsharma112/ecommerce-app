<script lang="ts">
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { updateFlash } from "sveltekit-flash-message/client";

  import { toast } from "$lib/utilities/toast";

  export let userCart = [];
  export let showTotal = false;
  export let isModalView = false;
  export let hideDeleteCart = false;

  export let shippingCharge;

  $: subtotal = userCart.reduce((acc, current) => {
    const quantity = current.quantity;
    const price = current.product.price;
    const discount = current.product.discount ?? 0;

    return acc + (price - discount) * quantity;
  }, 0);
</script>

<ul class="divide-y divide-gray-200 flex-1 overflow-auto">
  {#each userCart as cart (cart.id)}
    <li class="flex py-3">
      <div
        class="h-20 mx-3 p-1.5 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          alt={cart.product.title}
          src={cart.product.images[0]?.url}
          class="h-full w-full rounded-md object-cover object-center" />
      </div>
      <div class="mx-3 flex flex-1 flex-col">
        <div>
          <div class="flex justify-between text-base font-medium text-gray-900">
            <a href="/products/{cart.product.id}" class="hover:text-primary-500"
              >{cart.product.title}</a>
            <p class="ml-4">${cart.product.price}</p>
          </div>
          <div class="inline-flex items-center space-x-2 w-full">
            <p class="text-sm text-gray-500">{cart.product.tags}</p>

            {#if !hideDeleteCart}
              <form
                method="post"
                action="/cart?/removeFromCart"
                class="contents"
                use:enhance={() => {
                  toast.show({ id: "cart", type: "loading", message: "Loading..." });
                  return async () => {
                    updateFlash(page);
                    history.pushState(undefined, undefined, $page.url);
                    await invalidateAll();
                    history.pushState(undefined, undefined, "/cart");
                  };
                }}>
                <input type="hidden" name="productId" value={cart.product.id} />
                <button
                  type="submit"
                  class="bg-transparent font-medium text-xs text-red-600 ml-auto w-8 h-8 rounded-full hover:bg-red-50">
                  <i class="i-heroicons-trash w-6 h-6" />
                </button>
              </form>
            {/if}
          </div>
        </div>

        <div class="mt-2 inline-flex items-center space-x-2">
          <label for="quantity" class="text-xs font-medium cursor-pointer"> Quantity: </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            class="text-sm max-w-20 px-0 py-0 bg-transparent border-0 focus:ring-0 focus:border-b"
            bind:value={cart.quantity}
            min="0"
            max={cart.product.quantity}
            disabled={isModalView} />
        </div>
      </div>
    </li>
  {/each}
</ul>

<div class="border-t border-gray-200 py-3">
  <div class="inline-flex items-center w-full justify-between text-base text-gray-900 px-4 py-1">
    <p>Subtotal</p>
    <p class="font-medium">${subtotal}</p>
  </div>
  {#if !showTotal}
    <p class="text-sm text-gray-500 px-4">Shipping and taxes are calculated at checkout.</p>
  {:else}
    <div class="inline-flex items-center w-full justify-between text-base text-gray-900 px-4 py-1">
      <p>Shipping</p>
      <p class="font-medium">${shippingCharge}</p>
    </div>

    <!-- <div class="inline-flex items-center w-full justify-between text-base text-gray-900 px-4 py-1">
      <p>Taxes</p>
      <p class="font-medium">$262.00</p>
    </div> -->

    <div class="inline-flex items-center w-full justify-between text-base text-gray-900 px-4 py-1">
      <p>Extra Discounts</p>
      <p class="font-medium">$0.00</p>
    </div>

    <div class="inline-flex items-center w-full text-base text-gray-900 px-4 py-2">
      <div class="w-full inline-flex items-center w-full justify-between border-t pt-2">
        <p>Total</p>
        <p class="font-medium">${subtotal + shippingCharge}</p>
      </div>
    </div>

    <!-- <div class="px-4 py-3 border-t mt-2">
      <label for="coupon" class="">Discount coupon</label>
      <div class="inline-flex items-center w-full space-x-2 mt-1">
      <input type="text" id="coupon" name="coupon" class="flex-1 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500" />
      <button class="px-3 py-2 rounded-lg text-white bg-black focus:ring-2 focus:ring-black focus:ring-offset-2">Apply Coupon</button>
      </div>
    </div> -->

    <div class="border-t px-4 pt-4 pb-2">
      <button
        type="submit"
        class="block rounded-lg w-full py-3 text-sm font-medium text-white bg-primary-500 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >Confirm order</button>
    </div>
  {/if}
</div>
