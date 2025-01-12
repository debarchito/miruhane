<script lang="ts">
  let { title, description = "", Icon, ...rest } = $props();
</script>

<div class="relative mb-12 text-center" {...rest}>
  <div
    class="absolute -inset-[50px] animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-30 blur-2xl"
  ></div>
  <div class="flex flex-col items-center justify-center gap-3 md:flex-row">
    <div class="rounded-xl bg-primary/10 p-3">
      <Icon class="h-8 w-8 text-primary" />
    </div>
    <h3 class="text-3xl font-bold text-primary">{title}</h3>
  </div>
  {#if description}
    <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground/80">
      {description}
    </p>
  {/if}
</div>
