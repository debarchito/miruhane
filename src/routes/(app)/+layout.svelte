<script lang="ts">
  // import MenuBar from "$lib/components/custom/MenuBar.svelte";

  let { children } = $props();
</script>

<div class="relative min-h-screen">
  {@render children()}
</div>
