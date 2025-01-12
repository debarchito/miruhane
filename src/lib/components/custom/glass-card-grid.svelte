<script lang="ts">
  import { cn } from "$lib/utils";
  import { ArrowRight } from "lucide-svelte";

  type Entry = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
    description: string;
    link?: string;
  };

  let { entries }: { entries: Entry[] } = $props();
</script>

<!-- <div
  class="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15 blur-3xl"
></div> -->

<div class="relative grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-3 md:p-8">
  {#each entries as entry}
    <div
      class={cn(
        "group rounded-2xl border border-border/30 bg-background/40 p-6 backdrop-blur-xl transition-all duration-300",
        "hover:-translate-y-2 hover:border-border/50 hover:shadow-lg md:p-8",
      )}
    >
      <div
        class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110"
      >
        <entry.icon class="h-6 w-6 text-primary" />
      </div>
      <h3 class="mb-3 text-xl font-semibold">{entry.title}</h3>
      <p class="text-muted-foreground/70">{entry.description}</p>
      {#if entry.link}
        <a
          href={entry.link}
          class="mt-4 inline-flex items-center gap-2 text-sm text-primary opacity-70 transition-all duration-300 hover:underline hover:opacity-100"
        >
          Read more
          <ArrowRight class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      {/if}
    </div>
  {/each}
</div>
