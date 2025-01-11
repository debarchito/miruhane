<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>History | miruhane.</title>
</svelte:head>

{#each data.history as entry}
  <div>
    <h2>{entry.title}</h2>
    <p>{entry.updatedAt}</p>
    <p>{entry.title}</p>
  </div>
{/each}
