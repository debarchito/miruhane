<script lang="ts">
  import type { PageData } from "./$types";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import { ArrowLeft, ArrowRight, Clock, MessageCircle } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
  const initialHistoryLog = data.history;
</script>

<svelte:head>
  <title>History | miruhane.</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <Button.Root variant="outline" class="mb-6" onclick={() => history.back()}>
    <ArrowLeft class="h-4 w-4" />
  </Button.Root>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#if initialHistoryLog.length === 0}
      <div class="col-span-full text-center text-muted-foreground">No history found</div>
    {:else}
      {#each initialHistoryLog as historyEntry}
        <Card.Root
          class="bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <Card.Header>
            <div class="flex items-center">
              <MessageCircle class="mr-2 h-5 w-5" />
              <Card.Title class="text-lg font-semibold"
                >{historyEntry.title.slice(0, -7)}</Card.Title
              >
            </div>
            <Card.Description class="flex items-center text-xs">
              <Clock class="mr-1 h-3 w-3" />
              {historyEntry.updatedAt.toLocaleDateString()}
            </Card.Description>
          </Card.Header>
          <Card.Footer class="flex justify-end">
            <Button.Root variant="outline" size="sm" class="transition-colors">
              <a href="/history/{historyEntry.id}"><ArrowRight class="h-3 w-3" /></a>
            </Button.Root>
          </Card.Footer>
        </Card.Root>
      {/each}

      <div class="mt-6 flex justify-center">
        <Button.Root variant="outline">Load More</Button.Root>
      </div>
    {/if}
  </div>
</div>
