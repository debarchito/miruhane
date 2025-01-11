<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import { ArrowLeft, Clock, MessageCircle } from "lucide-svelte";
  let { data } = $props();
</script>

<div class="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
  <Button.Root variant="ghost" class="mb-6 hover:bg-secondary/20" onclick={() => history.back()}>
    <ArrowLeft class="mr-2 h-4 w-4" />
    Back
  </Button.Root>

  <Card.Root class="mb-6 w-full border-0 bg-background/50 shadow-sm backdrop-blur-sm">
    <Card.Header>
      <div class="flex items-center">
        <MessageCircle class="mr-2 h-5 w-5 text-primary" />
        <Card.Title class="truncate text-lg font-medium">{data.res.title.slice(0, -7)}</Card.Title>
      </div>
      <Card.Description class="flex items-center text-xs text-muted-foreground">
        <Clock class="mr-1 h-3 w-3" />
        {new Date(data.res.createdAt).toLocaleDateString()}
      </Card.Description>
    </Card.Header>
  </Card.Root>

  <div class="space-y-6">
    {#each [...data.res.chatEntries].reverse() as entry}
      <div class={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
        <div
          class={`max-w-[95%] sm:max-w-[80%] ${entry.role === "user" ? "items-end" : "items-start"}`}
        >
          <div class="mb-1 text-sm font-medium text-muted-foreground">
            {entry.role === "user" ? "You" : "Miruhane"}
          </div>
          <div
            class={`rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 ${
              entry.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/30"
            }`}
          >
            <div class="whitespace-pre-wrap text-sm">{entry.content}</div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if data.meta.hasMore}
    <div class="mt-8 flex justify-center">
      <Button.Root variant="outline" class="text-sm">Load More Messages</Button.Root>
    </div>
  {/if}
</div>
