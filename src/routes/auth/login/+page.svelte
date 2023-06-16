<script>
  import { page } from "$app/stores";
  import { applyAction } from "$app/forms";
  import { invalidateAll, goto } from "$app/navigation";
  import { superForm } from "sveltekit-superforms/client";
  import { updateFlash } from "sveltekit-flash-message/client";

  import { referer } from "$lib/utilities/stores";
  import { loginSchema } from "$lib/utilities/zod-schema";
  import PasswordInput from "$lib/components/PasswordInput.svelte";

  export let onSuccess = undefined;
  export let onNavigate = undefined;

  const { form, errors, enhance } = superForm($page.data.form, {
    applyAction: false,
    taintedMessage: false,
    validators: loginSchema,
    async onResult({ result }) {
      if ((result.type = "redirect")) {
        if (typeof onSuccess === "function") {
          onSuccess();
          invalidateAll();
        } else {
          applyAction(result);
        }
      }
    }
  });
</script>

<svelte:head>
  <title>Login in to your account</title>
</svelte:head>

<div class="w-full sm:w-md mx-auto py-10 px-4">
  <div class="pb-6">
    <div class="inline-flex items-center">
      <img alt="brand-logo" src="/app-logo.svg" class="w-13 h-13" />
      <h1 class="text-3xl ml-3 font-dancing-script">Shopper's Stop</h1>
    </div>
    <h1 class="text-2xl font-medium">Login in to your account</h1>
    <div>
      <small class="text-sm">Don't have an account?</small>
      <a
        class="font-medium text-sm text-primary-500 hover:underline"
        href="/auth/register"
        on:click={onNavigate}>
        Register
      </a>
    </div>
  </div>

  <form action="/auth/login" method="post" class="space-y-3" use:enhance>
    <div>
      <label for="email" class="text-base text-gray-800">Email address</label>
      <input
        id="email"
        type="text"
        name="email"
        bind:value={$form.email}
        data-invalid={!!$errors.email}
        class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1 focus:ring-primary-500 focus:border-primary-500"
        placeholder="Enter your email address." />
      {#if $errors.email}
        <small class="text-red-600 text-sm">{$errors.email?.[0]}</small>
      {/if}
    </div>

    <div>
      <PasswordInput
        id="password"
        name="password"
        error={$errors.password?.[0]}
        onInput={(e) => {
          $form.password = e.target.value;
        }}
        placeholder="Enter your password." />
    </div>

    <div class="inline-flex w-full items-center">
      <a href="/reset-pwd" class="text-primary-500 font-medium text-sm hover:underline ml-auto"
        >Forgot password?</a>
    </div>

    <div>
      <button
        type="submit"
        class="block text-base font-bold text-gray-100 hover:text-white hover:bg-primary-600 w-full rounded-lg bg-primary-500 text-white py-2 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >Login</button>
    </div>
  </form>

  <!--  <div class="flex items-center w-full py-5">
    <div class="w-full h-1 bg-gray-200 rounded-lg" />
    <p class="w-full text-center text-sm">Or, continue with</p>
    <div class="w-full h-1 bg-gray-200 rounded-lg" />
  </div>

  <div class="inline-flex items-center text-center justify-center w-full space-x-5">
    <a href="#" class="text-[#3b5998] hover:text-[#3b5998]/90"
      ><i class="i-bi-facebook w-10 h-10" /></a>
    <a href="#" class="text-[#4285F4] hover:text-[#4285F4]/90"
      ><i class="i-bi-google w-10 h-10" /></a>
  </div> -->
</div>
