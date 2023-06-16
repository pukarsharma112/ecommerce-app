<script>
    import { page } from '$app/stores';
</script>

<div class="flex min-h-full flex-col bg-white pt-16 pb-12">
  <main class="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div class="text-center py-16">
        <h1 class="text-4xl sm:text-5xl font-semibold text-indigo-600">{$page.status}</h1>
        <h1 class="mt-2 text-base font-bold tracking-tight text-gray-900">{$page.error.message}</h1>
        <div class="mt-6">
          <a href="/" class="text-base font-medium text-indigo-600 hover:text-indigo-500">
            Go back home
            <span aria-hidden="true"> &rarr;</span>
          </a>
      </div>
    </div>
  </main>
  <footer class="mx-auto w-full max-w-7xl flex-shrink-0 px-4 sm:px-6 lg:px-8">
    <nav class="flex justify-center space-x-4">
      <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-600">Contact Support</a>
      <span class="inline-block border-l border-gray-300" aria-hidden="true"></span>
      <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-600">Status</a>
      <span class="inline-block border-l border-gray-300" aria-hidden="true"></span>
      <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-600">Twitter</a>
    </nav>
  </footer>
</div>
