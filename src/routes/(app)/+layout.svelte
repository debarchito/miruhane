<script lang="ts">
  import MenuBar from "$lib/components/custom/MenuBar.svelte";

  let { children } = $props();
</script>

<div class="relative min-h-screen">
  <div class="relative z-10">
    <MenuBar />
  </div>
  <div class="mt-8">
    {@render children()}
  </div>
</div>
