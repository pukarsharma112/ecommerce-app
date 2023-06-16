<script>
  import { clsx } from "clsx";

  export let showHints = false;
  export let showPasswordToggle = true;
  let className = undefined;

  export let id;
  export { className as class };
  export let value = null;
  export let label = undefined;
  export let error = undefined;

  export let onBlur = undefined;
  export let onInput = undefined;

  let hintsShown = false;
  let passwordShown = false;

  let securityLevel = -1;

  let has12Letters = false;
  let hasMixedCase = false;
  let hasSpecialCharacter = false;

  const handleInput = (ev) => {
    securityLevel = -1;
    value = ev.target.value;

    if (!value) return;

    // validation
    if (value.trim()) {
      securityLevel += 1;
    }

    if (value.trim()?.length >= 12) {
      has12Letters = true;
      securityLevel += 1;
    } else {
      has12Letters = false;
    }

    if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(value)) {
      hasMixedCase = true;
      securityLevel += 1;
    } else {
      hasMixedCase = false;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      hasSpecialCharacter = true;
      securityLevel += 1;
    } else {
      hasSpecialCharacter = false;
    }

    hintsShown = true;
    onInput?.(ev);
  };
  const handleBlur = (ev) => {
    hintsShown = false;
    onBlur?.(ev);
  };

  const handleShowPassword = () => {
    passwordShown = !passwordShown;
  };
</script>

<slot name="label">
  <label for={id} class="text-base text-gray-800 capitalize">{label || id}</label>
</slot>
<div class="relative">
  <input
    {id}
    {value}
    type={passwordShown ? "text" : "password"}
    autocomplete={id}
    on:blur={handleBlur}
    data-invalid={!!error}
    on:input={handleInput}
    class={clsx(
      "block w-full rounded-lg border border-gray-300 text-sm shadow-sm mt-1 focus:ring-primary-500 focus:border-primary-500",
      {
        "pr-8": showPasswordToggle,
        [`${className}`]: !!className
      }
    )}
    class:pr-8={showPasswordToggle}
    placeholder="••••••••"
    {...$$restProps} />
  {#if showPasswordToggle}
    <button
      type="button"
      class="absolute h-full inline-flex items-center px-2 bg-transparent rounded-lg right-0 top-0"
      on:click={handleShowPassword}>
      <i
        class={clsx("h-6 w-6", {
          "i-heroicons-eye": !passwordShown,
          "i-heroicons-eye-slash": passwordShown
        })} />
    </button>
  {/if}

  {#if showHints && hintsShown}
    <div
      class="absolute w-full z-10 inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-xl shadow-sm mt-1 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
      <div class="p-3 space-y-2">
        <h3 class="font-semibold text-gray-900 dark:text-white">Must have at least 6 characters</h3>
        <div class="grid grid-cols-4 gap-2">
          {#if securityLevel === -1}
            <div class="rounded h-1 bg-gray-300 dark:bg-gray-400" />
          {:else if securityLevel === 0}
            <div class="rounded h-1 bg-red-300 dark:bg-red-400" />
          {:else if securityLevel === 1}
            <div class="rounded h-1 bg-orange-300 dark:bg-orange-400" />
            <div class="rounded h-1 bg-orange-300 dark:bg-orange-400" />
          {:else if securityLevel === 2}
            <div class="rounded h-1 bg-green-300 dark:bg-green-400" />
            <div class="rounded h-1 bg-green-300 dark:bg-green-400" />
            <div class="rounded h-1 bg-green-300 dark:bg-green-400" />
          {:else}
            <div class="rounded h-1 bg-green-500" />
            <div class="rounded h-1 bg-green-500" />
            <div class="rounded h-1 bg-green-500" />
            <div class="rounded h-1 bg-green-500" />
          {/if}
        </div>
        <p>It’s better to have:</p>
        <ul class="space-y-1">
          <li class="flex items-center font-normal">
            {#if hasMixedCase}
              <i class="i-bi-check w-6 h-6 text-green-500" />
            {:else}
              <i class="i-bi-x w-6 h-6 text-red-500" />
            {/if}
            Upper & lower case letters
          </li>
          <li class="flex items-center font-normal">
            {#if hasSpecialCharacter}
              <i class="i-bi-check w-6 h-6 text-green-500" />
            {:else}
              <i class="i-bi-x w-6 h-6 text-red-500" />
            {/if}
            Some special symbol (#$&)
          </li>
          <li class="flex items-center font-normal">
            {#if has12Letters}
              <i class="i-bi-check w-6 h-6 text-green-500" />
            {:else}
              <i class="i-bi-x w-6 h-6 text-red-500" />
            {/if}
            A longer password (min. 12 chars.)
          </li>
        </ul>
      </div>
    </div>
  {/if}
</div>
{#if error}
  <small class="text-red-500">{error}</small>
{/if}
