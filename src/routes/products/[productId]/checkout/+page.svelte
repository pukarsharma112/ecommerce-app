<script>
  import { page } from "$app/stores";
  import { updateFlash } from "sveltekit-flash-message/client";
  import { superForm } from "sveltekit-superforms/client";

  import { toast } from "$lib/utilities/toast";
  import Cart from "$lib/components/Cart.svelte";
  import { referer } from "$lib/utilities/stores";
  import { checkoutBillingSchema } from "$lib/utilities/zod-schema";

  export let data;

  const { form, enhance, errors } = superForm(data.form, {
    validators: checkoutBillingSchema
  });
</script>

<svelte:head>
  <title>Product checkout</title>
</svelte:head>

<div class="px-4 pt-2">
  <a href={$referer} class="text-primary-500 hover:underline inline-flex items-center">
    <i class="i-heroicons-chevron-left w-5 h-5 mr-1" />
    <span>Back</span>
  </a>
</div>

<form
  method="post"
  class="flex flex-col lg:flex-row py-8 px-6 space-y-5 lg:space-y-0"
  use:enhance={() => {
    toast.show({ id: "checkout", type: "loading", message: "Loading..." });
  }}>
  <!-- payment form section -->
  <div class="w-full lg:pr-10 space-y-5 divide-y divide-gray-300">
    <div class="space-y-2">
      <h1 class="text-lg font-medium">Contact information</h1>
      <div>
        <label for="email">Email address</label>
        <input
          required
          id="email"
          type="email"
          name="email"
          bind:value={$form.email}
          data-invalid={!!$errors.email?.[0]}
          class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1" />
        {#if $errors.email?.[0]}
          <small class="text-red-500">{$errors.email[0]}</small>
        {/if}
      </div>
    </div>

    <div class="space-y-3">
      <h1 class="text-lg font-medium mt-4">Shipping information</h1>

      <div>
        <label for="fullName">Full name</label>
        <input
          required
          type="text"
          id="fullName"
          name="fullName"
          bind:value={$form.fullName}
          data-invalid={!!$errors.fullName?.[0]}
          class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1" />
        {#if $errors.fullName?.[0]}
          <small class="text-red-500">{$errors.fullName[0]}</small>
        {/if}
      </div>

      <div>
        <label for="address">Address</label>
        <input
          required
          type="text"
          id="address"
          name="address"
          bind:value={$form.address}
          data-invalid={!!$errors.address?.[0]}
          class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1" />
        {#if $errors.address?.[0]}
          <small class="text-red-500">{$errors.address[0]}</small>
        {/if}
      </div>

      <div class="flex <sm:flex-col <sm:space-y-3 sm:space-x-3">
        <div class="w-full">
          <label for="city">City</label>
          <input
            required
            type="text"
            id="city"
            name="city"
            bind:value={$form.city}
            data-invalid={!!$errors.city?.[0]}
            class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1" />
          {#if $errors.city?.[0]}
            <small class="text-red-500">{$errors.city[0]}</small>
          {/if}
        </div>

        <div class="w-full">
          <label for="country">Country</label>
          <input
            required
            type="text"
            id="country"
            name="country"
            bind:value={$form.country}
            data-invalid={!!$errors.country?.[0]}
            class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1" />
          {#if $errors.country?.[0]}
            <small class="text-red-500">{$errors.country[0]}</small>
          {/if}
        </div>
      </div>

      <div class="flex <sm:flex-col <sm:space-y-3 sm:space-x-3">
        <div class="w-full">
          <label for="state">State</label>
          <input
            required
            type="text"
            id="state"
            name="state"
            bind:value={$form.state}
            data-invalid={!!$errors.state?.[0]}
            class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1" />
          {#if $errors.state?.[0]}
            <small class="text-red-500">{$errors.state[0]}</small>
          {/if}
        </div>

        <div class="w-full">
          <label for="postalCode">Postal code</label>
          <input
            required
            type="text"
            id="postalCode"
            name="postalCode"
            bind:value={$form.postalCode}
            data-invalid={!!$errors.postalCode?.[0]}
            class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1" />
          {#if $errors.postalCode?.[0]}
            <small class="text-red-500">{$errors.postalCode[0]}</small>
          {/if}
        </div>
      </div>

      <div>
        <label for="phoneNumber">Phone number</label>
        <input
          required
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          bind:value={$form.phoneNumber}
          data-invalid={!!$errors.phoneNumber?.[0]}
          class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1" />
        {#if $errors.phoneNumber?.[0]}
          <small class="text-red-500">{$errors.phoneNumber[0]}</small>
        {/if}
      </div>
    </div>

    <div class="space-y-3">
      <h1 class="text-lg font-medium mt-4">Payment</h1>
      <div class="inline-flex items-center w-full space-x-4 pb-4">
        <div class="inline-flex items-center space-x-2">
          <input
            required
            type="radio"
            name="paymentMethod"
            id="cash-on-delivery"
            value="cash-on-delivery"
            class="checked:bg-primary-500 focus:ring-primary-500 text-primary-500" />
          <label for="cash-on-delivery" class="text-sm font-medium">Cash on delivery</label>
        </div>

        <div class="inline-flex items-center space-x-2">
          <input
            required
            type="radio"
            name="paymentMethod"
            id="pay-with-stripe"
            value="pay-with-stripe"
            class="checked:bg-primary-500 focus:ring-primary-500 text-primary-500" />
            <label for="pay-with-stripe" class="text-sm font-medium">Pay with stripe</label>
        </div>
      </div>
    </div>
  </div>

  <!-- cart preview section -->
  <div class="w-full">
    <div class="sticky top-0">
      <h1 class="text-lg font-medium font-gray-700">Order summary</h1>
      <div class="bg-white rounded-lg border border-gray-300 shadow-sm mt-4">
        <Cart
          showTotal
          userCart={[
            {
              quantity: 1,
              id: data.product.id,
              product: data.product
            }
          ]}
          hideDeleteCart />
      </div>
    </div>
  </div>
</form>
