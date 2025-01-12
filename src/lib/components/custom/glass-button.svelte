<script lang="ts">
  import { cn } from "$lib/utils";
  import * as Button from "$lib/components/ui/button/index.js";

  const { children, type = "button", href = "#", ...rest } = $props();

  const baseClasses =
    "group relative inline-flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-background/90 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 sm:text-base";
</script>

{#if type === "button"}
  <Button.Root class={cn(baseClasses)} {...rest}>
    {@render children()}
    <div
      class="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/10 to-primary/10 opacity-0 blur transition duration-300 group-hover:opacity-100"
    ></div>
  </Button.Root>
{:else}
  <a {href} class={cn(baseClasses)} {...rest}>
    {@render children()}
    <div
      class="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/10 to-primary/10 opacity-0 blur transition duration-300 group-hover:opacity-100"
    ></div>
  </a>
{/if}
