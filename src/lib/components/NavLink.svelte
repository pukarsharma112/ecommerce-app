<script>
  import { clsx } from "clsx";
  import { page } from "$app/stores";

  export let href;
  let className = undefined;
  export let exact = false;
  export let activeclass = undefined;

  export { className as class };

  $: active = exact ? $page.url.pathname === href : $page.url.pathname.includes(href);
</script>

<a
  {href}
  {...$$restProps}
  aria-current={active ? "page" : undefined}
  class={clsx(className, { [`${activeclass}`]: active && activeclass })}>
  <slot />
</a>
