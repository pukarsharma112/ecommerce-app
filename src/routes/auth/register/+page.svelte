<script>
  import { page } from "$app/stores";
  import { applyAction } from "$app/forms";
  import { goto, invalidateAll } from "$app/navigation";
  import { superForm } from "sveltekit-superforms/client";
  import { updateFlash } from "sveltekit-flash-message/client";

  import { referer } from "$lib/utilities/stores";
  import { registerSchema } from "$lib/utilities/zod-schema";
  import PasswordInput from "$lib/components/PasswordInput.svelte";

  export let onSuccess = undefined;
  export let onNavigate = undefined;

  const { form, errors, message, enhance } = superForm($page.data.form, {
    applyAction: false,
    taintedMessage: false,
    validators: registerSchema,
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
  <title>Register an account</title>
</svelte:head>

<div class="w-full sm:w-md mx-auto pt-10 px-4">
  <div class="pb-4">
    <div class="inline-flex items-center">
      <img alt="brand-logo" src="/app-logo.svg" class="w-13 h-13" />
      <h1 class="text-3xl ml-3 font-dancing-script">FamilyStore</h1>
    </div>
    <h1 class="text-2xl font-medium">Create an account</h1>
    <div>
      <small class="text-sm">Already have an account?</small>
      <a
        class="font-medium text-sm text-primary-500 hover:underline"
        href="/auth/login"
        on:click={onNavigate}>
        Login
      </a>
    </div>
  </div>

  <form action="/auth/register" method="post" class="space-y-3" use:enhance>
    <div>
      <label for="name" class="text-base text-gray-800">Full name</label>
      <input
        id="name"
        type="text"
        name="name"
        bind:value={$form.name}
        data-invalid={!!$errors.name}
        class="block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1 focus:ring-primary-500 focus:border-primary-500"
        placeholder="Enter your full name" />
      {#if $errors.name}
        <small class="text-red-600 text-sm">{$errors.name?.[0]}</small>
      {/if}
    </div>
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
        name="password"
        id="password"
        showHints
        error={$errors.password?.[0]}
        onInput={(e) => {
          $form.password = e.target.value;
        }} />
    </div>

    <div class="pt-3">
      <button
        type="submit"
        class="block text-base font-bold text-gray-100 hover:text-white hover:bg-primary-600 w-full rounded-lg bg-primary-500 text-white py-2 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >Submit</button>
    </div>
  </form>
</div>
