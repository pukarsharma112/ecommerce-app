<script>
  import { clsx } from "clsx";

  export let data;
</script>

<div class="mx-auto py-4">
  <div class="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
    <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
    <p class="mt-2 text-sm text-gray-500">
      Check the status of recent orders, manage returns, and discover similar products.
    </p>
  </div>
</div>

<div class="mx-auto max-w-7xl sm:px-2 lg:px-8 py-4">
  <div class="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
    {#each data.invoices as invoice}
      {@const date = new Date(invoice.createdAt).toDateString()}

      <details
        class="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border relative group"
        open>
        <summary class="flex flex-col border-b border-gray-200 p-4 cursor-pointer">
          <div class="flex items-center w-full">
            <div class="w-full">
              <div class="font-medium text-gray-900">Order number</div>
              <div class="mt-1 text-gray-500 text-xs md:text-sm pr-3">{invoice.id}</div>
            </div>
            <div class="w-full">
              <div class="font-medium text-gray-900">Date placed</div>
              <div class="mt-1 text-gray-500 text-xs md:text-sm">
                <time datetime={date}>{date}</time>
              </div>
            </div>
            <div class="w-full">
              <div class="font-medium text-gray-900">Total amount</div>
              <div class="mt-1 font-medium text-gray-900 text-xs md:text-sm">${invoice.total}</div>
            </div>
          </div>

          <div
            class="flex w-full justify-between mt-4 group-open:absolute group-open:bottom-2 group-open:pr-8">
            <!-- Heroicon name: mini/check-circle -->
            <div class="inline-flex items-center">
              {#if invoice.status === "processing"}
                <i class="i-bi-info-circle-fill text-blue-500" />
              {:else if invoice.status === "delivered"}
                <i class="i-bi-check-circle-fill text-green-500" />
              {/if}
              <p class="ml-2 text-sm font-medium text-gray-500 uppercase">
                {invoice.status} | <time datetime="2021-07-12">July 12, 2021</time>
              </p>
            </div>

            <div
              class={clsx("inline-flex items-center", {
                "text-green-500": invoice.paid,
                "text-red-400": !invoice.paid
              })}
              title={invoice.paid ? "Paid." : "Not paid."}>
              <i
                class={clsx({
                  "i-heroicons-banknotes": invoice.paymentMethod === "cash-on-delivery",
                  "i-heroicons-credit-card": true
                })} />
              <p class="ml-2 text-sm font-medium">{invoice.paymentMethod?.replaceAll("-", " ")}</p>
            </div>
          </div>
        </summary>

        <!-- Products -->
        <ul class="divide-y divide-gray-200 pb-3">
          {#each invoice.orders as order (order.id)}
            <li class="p-4 sm:p-6">
              <div class="flex items-center sm:items-start">
                <div
                  class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                  <img
                    alt={order.product.title}
                    src={order.product.images[0]?.url}
                    class="h-full w-full object-cover object-center" />
                </div>
                <div class="ml-6 flex-1 text-sm">
                  <div class="font-medium text-gray-900 sm:flex sm:justify-between">
                    <a href="/products/{order.product.id}" class="text-md hover:text-primary-500">{order.product.title}</a>
                    <p class="mt-2 sm:mt-0">${order.product.price} x {order.quantity}</p>
                  </div>
                  <p class="hidden text-gray-500 sm:mt-2 sm:block">
                    {@html order.product.description}
                  </p>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </details>
    {/each}

    <!-- More orders... -->
  </div>
</div>
