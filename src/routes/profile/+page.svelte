<script lang="ts">
  import { clsx } from "clsx";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { superForm } from "sveltekit-superforms/client";

  import { toast } from "$lib/utilities/toast";
  import PasswordInput from "$lib/components/PasswordInput.svelte";
  import { profileSchema, updatePasswordSchema } from "$lib/utilities/zod-schema";

  export let data;

  const {
    form: profileForm,
    errors: profileErrors,
    enhance: profileFormEnhance,
    submitting: profileSubmitting
  } = superForm(data.profileForm, {
    validators: profileSchema,
    onSubmit() {
      toast.show({
        type: "loading",
        id: "update-profile",
        message: "Loading..."
      });
    }
  });

  const {
    form: passwordForm,
    errors: passwordErrors,
    enhance: passwordFormEnhance,
    submitting: passwordSubmitting
  } = superForm(data.passwordForm, {
    resetForm: true,
    validators: updatePasswordSchema,
    onSubmit() {
      toast.show({
        type: "loading",
        id: "update-password",
        message: "Loading..."
      });
    },
    onResult() {
      toast.remove("update-password");
    }
  });

  let imgSrc = undefined,
    isUploaded = false,
    imgRef = undefined;

  const handleUpload = (ev: any) => {
    const imgFile = ev.target.files[0];
    if (imgFile) {
      isUploaded = true;
      imgSrc = imgRef.src;
      imgRef.src = window.URL.createObjectURL(imgFile);
    }
  };
</script>

<div class="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4 select-none">
  <div class="col-span-full">
    <div class="inline-flex items-center space-x-2 text-sm font-medium mt-4 mb-2">
      <a
        href="/"
        class="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
        <i class="i-bi-house w-5 h-5 mr-1" />
        Home
      </a>
      <span>/</span>
      <a href="/packages" class="ml-1 text-gray-700 pointer-events-none md:ml-2 dark:text-gray-300">
        <i class="i-bi-gear-wide-connected w-4 h-4 mr-1" />
        Settings
      </a>
    </div>

    <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
      Accounts &amp; settings
    </h1>
  </div>
  <!-- left side content -->
  <div class="col-span-full xl:col-auto relative">
    <!-- profile picture -->
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
        <img
          alt=""
          bind:this={imgRef}
          src={$page.data.currentUser?.avatar}
          class="mt-4 sm:mt-2 mb-4 rounded-xl w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0" />
        <div>
          <h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-white">Profile picture</h3>
          <!-- <div class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              JPG, GIF or PNG. Max size of 800K
            </div> -->
          <div class="flex items-center space-x-4 -ml-2">
            <form
              method="post"
              enctype="multipart/form-data"
              action="/profile?/updateAvatar"
              class="inline-flex items-center space-x-2"
              use:enhance={() => {
                toast.show({
                  type: "loading",
                  id: "user-avatar",
                  message: "Loading..."
                });
              }}>
              <input
                type="file"
                class="hidden"
                accept="image/*"
                id="profilePicture"
                name="profilePicture"
                on:change={handleUpload} />

              {#if isUploaded}
                <button
                  type="submit"
                  formmethod="/profile?/deleteAvatar"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-xl !bg-primary-700 !hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 !dark:bg-primary-600 !dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  <i class="i-heroicons-cloud-arrow-up h-5 w-5 mr-2" />
                  Submit
                </button>

                <button
                  type="button"
                  class="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  Cancel
                </button>
              {:else}
                <label
                  for="profilePicture"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-xl !bg-primary-700 !hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 !dark:bg-primary-600 !dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer">
                  <i class="i-heroicons-cloud-arrow-up h-5 w-5 mr-2" />
                  Upload picture
                </label>
                <button
                  type="submit"
                  formaction="/profile?/deleteAvatar"
                  class="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  Delete
                </button>
              {/if}
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- social menu -->
    <div
      class="p-4 bg-white border border-gray-200 rounded-xl shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h3 class="text-xl font-semibold dark:text-white">Social accounts</h3>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="py-2">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <i class="i-bi-google w-6 h-6 text-[#4285F4]" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-base font-semibold text-gray-900 truncate dark:text-white">
                Google account
              </span>
            </div>
            <div class="inline-flex items-center">
              <!-- {#if $connectedAccounts.data?.has("google")} -->
              <a
                data-provider="google"
                href="/oauth/google/disconnect"
                class="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >Disconnect</a>
              <!-- {:else}
                  <a
                    href="/oauth/google?action=link-account"
                    class="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-white rounded-xl bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >Connect</a>
                {/if} -->
            </div>
          </div>
        </li>
        <li class="py-2">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <i class="i-bi-facebook w-6 h-6 text-[#3b5998] dark:text-blue-400" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-base font-semibold text-gray-900 truncate dark:text-white">
                Facebook account
              </span>
            </div>
            <div class="inline-flex items-center">
              <!-- {#if $connectedAccounts.data?.has("facebook")} -->
              <a
                data-provider="facebook"
                href="/oauth/facebook/disconnect"
                class="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >Disconnect</a>
              <!-- {:else}
                  <a
                    href="/oauth/facebook?action=link-account"
                    class="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-white rounded-xl bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >Connect</a>
                {/if} -->
            </div>
          </div>
        </li>
        <!-- WIP: Not implemented twitter -->
        <li class="py-4 hidden">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <i class="i-bi-twitter h-6 w-6 text-[#1da1f2]" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-base font-semibold text-gray-900 truncate dark:text-white">
                Twitter account
              </span>
            </div>
            <div class="inline-flex items-center">
              <!-- {#if $connectedAccounts.data?.has("twitter")} -->
              <a
                data-provider="twitter"
                href="/oauth/twitter/disconnect"
                class="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >Disconnect</a>
              <!--  {:else}
                  <a
                    href="/oauth/twitter?action=link-account"
                    class="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-white rounded-xl bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >Connect</a>
                {/if} -->
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- right side -->
  <div class="col-span-2 mt-4 md:m-0">
    <!-- general info -->
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h3 class="mb-4 text-xl font-semibold dark:text-white">General information</h3>
      <form
        method="post"
        action="?/updateProfile"
        autocomplete="off"
        class="space-y-3"
        use:profileFormEnhance>
        <div class="w-full sm:w-3/4">
          <label for="name" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            bind:value={$profileForm.name}
            data-invalid={!!$profileErrors.name?.[0]}
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Enter your full name"
            required />
          {#if $profileErrors.name}
            <small class="text-red-500">{$profileErrors.name[0]}</small>
          {/if}
        </div>

        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div class="w-full">
            <label for="email" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              bind:value={$profileForm.email}
              data-invalid={!!$profileErrors.email?.[0]}
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Please enter your email address"
              required />
            {#if $profileErrors.email}
              <small class="text-red-500">{$profileErrors.email[0]}</small>
            {/if}
          </div>
        </div>

        <div class="col-span-6 sm:col-full">
          <button
            type="submit"
            class="text-white !bg-primary-700 !hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center !dark:bg-primary-600 !dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            disabled={$profileSubmitting}>
            {#if $profileSubmitting}
              Loading...
            {:else}
              Update profile
            {/if}
          </button>
        </div>
      </form>
    </div>

    <!-- update password -->
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h3 class="mb-4 text-xl font-semibold dark:text-white">Password information</h3>
      <form method="post" action="?/updatePassword" autocomplete="off" use:passwordFormEnhance>
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-3">
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              bind:value={$passwordForm.currentPassword}
              error={$passwordErrors.currentPassword?.[0]}
              required>
              <label
                slot="label"
                for="currentPassword"
                class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >Current password</label>
            </PasswordInput>
          </div>
          <div class="col-span-6 sm:col-span-3 relative">
            <PasswordInput
              showHints
              id="password"
              name="password"
              bind:value={$passwordForm.password}
              error={$passwordErrors.password?.[0]}
              required>
              <label
                slot="label"
                for="password"
                class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >New password</label>
            </PasswordInput>
          </div>
          <div class="col-span-6 sm:col-span-3">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              bind:value={$passwordForm.confirmPassword}
              error={$passwordErrors.confirmPassword?.[0]}
              required>
              <label
                slot="label"
                for="confirmPassword"
                class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >Confirm password</label>
            </PasswordInput>
          </div>
          <div class="col-span-6 sm:col-full">
            <button
              class="text-white !bg-primary-700 !hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center !dark:bg-primary-600 !dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              type="submit"
              disabled={$passwordSubmitting}>
              {#if $passwordSubmitting}
                Loading...
              {:else}
                Update password
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<!--  <div class="grid grid-cols-1 px-4 xl:grid-cols-2 xl:gap-4 my-4">
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0">
      <div class="flow-root">
        <h3 class="text-xl font-semibold dark:text-white">Alerts & Notifications</h3>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Update your preference to get push notifications.
        </p>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Company News</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Get Themesberg news, announcements, and product updates
              </div>
            </div>
            <label for="company-news" class="relative flex items-center cursor-pointer">
              <input type="checkbox" id="company-news" class="sr-only" />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
            </label>
          </div>
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Account Activity
              </div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Get important notifications about you or activity you've missed
              </div>
            </div>
            <label for="account-activity" class="relative flex items-center cursor-pointer">
              <input type="checkbox" id="account-activity" class="sr-only" checked />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
            </label>
          </div>
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Meetups Near You
              </div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Get an email when a Dribbble Meetup is posted close to my location
              </div>
            </div>
            <label for="meetups" class="relative flex items-center cursor-pointer">
              <input type="checkbox" id="meetups" class="sr-only" checked />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
            </label>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">New Messages</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Get Themsberg news, announcements, and product updates
              </div>
            </div>
            <label for="new-messages" class="relative flex items-center cursor-pointer">
              <input type="checkbox" id="new-messages" class="sr-only" />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
            </label>
          </div>
        </div>
        <div class="mt-6">
          <button
            class="text-white !bg-primary-700 !hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center !dark:bg-primary-600 !dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >Save all</button>
        </div>
      </div>
    </div>
    <div
      class="p-4 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0">
      <div class="flow-root">
        <h3 class="text-xl font-semibold dark:text-white">Email Notifications</h3>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Update your preference to get notified on email.
        </p>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Rating reminders
              </div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Send an email reminding me to rate an item a week after purchase
              </div>
            </div>
            <label for="rating-reminders" class="relative flex items-center cursor-pointer">
              <input type="checkbox" id="rating-reminders" class="sr-only" />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
            </label>
          </div>
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Item update notifications
              </div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Send user and product notifications for you
              </div>
            </div>
            <label for="item-update" class="relative flex items-center cursor-pointer">
              <input type="checkbox" id="item-update" class="sr-only" checked />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
            </label>
          </div>
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Item comment notifications
              </div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Send me an email when someone comments on one of my items
              </div>
            </div>
            <label for="item-comment" class="relative flex items-center cursor-pointer">
              <input type="checkbox" id="item-comment" class="sr-only" checked />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
            </label>
          </div>
          <div class="flex items-center justify-between pt-4">
            <div class="flex flex-col flex-grow">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                Buyer review notifications
              </div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Send me an email when someone leaves a review with their rating
              </div>
            </div>
            <label for="buyer-rev" class="relative flex items-center cursor-pointer">
              <input type="checkbox" id="buyer-rev" class="sr-only" />
              <span
                class="h-6 bg-gray-200 border border-gray-200 rounded-full w-11 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
            </label>
          </div>
        </div>
        <div class="mt-6">
          <button
            class="text-white !bg-primary-700 !hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center !dark:bg-primary-600 !dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >Save all</button>
        </div>
      </div>
    </div>
  </div> -->
