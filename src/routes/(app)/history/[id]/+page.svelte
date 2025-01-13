<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Input from "$lib/components/ui/input/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import { ArrowLeft, Clock, MessageCircle, Search, X } from "lucide-svelte";
  let { data } = $props();
  let searchTerm = $state("");
  let loading = $state(false);
  let chatEntries = $state(data.res.chatEntries);
  let hasMore = $state(data.meta.hasMore);

  type TextPart = {
    text: string;
    highlight: boolean;
  };

  const highlightText = (text: string, terms: string[]): TextPart[] => {
    if (terms.length === 0) return [{ text, highlight: false }];

    let parts: TextPart[] = [{ text, highlight: false }];

    terms.forEach((term) => {
      if (!term) return;
      const regex = new RegExp(`(${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
      parts = parts.flatMap((part) => {
        if (!part.highlight) {
          const splits = part.text.split(regex);
          return splits.map((split) => ({
            text: split,
            highlight: split.toLowerCase() === term.toLowerCase(),
          }));
        }
        return [part];
      });
    });

    return parts;
  };

  const loadMoreMessages = async () => {
    loading = true;
    try {
      const lastEntry = chatEntries[chatEntries.length - 1];
      const body = await fetch("/api/history/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          historyId: data.res.id,
          cursor: new Date(lastEntry.createdAt),
          pageSize: 10,
          direction: "next",
          order: "asc",
        }),
      });
      const res = await body.json();
      chatEntries = [...chatEntries, ...res.res.chatEntries];
      hasMore = res.meta.hasMore;
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      loading = false;
    }
  };

  const filteredEntries = $derived(
    chatEntries.filter((entry) => {
      const content = entry.content.toLowerCase();
      const terms = searchTerm
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 0);
      return terms.length === 0 || terms.every((term) => content.includes(term));
    }),
  );
</script>

<svelte:head>
  <title>{data.res.title.slice(0, -7)} | miruhane.</title>
</svelte:head>

<div class="container-fluid mx-auto max-w-4xl px-4 py-4 sm:px-4 sm:py-8">
  <div class="fixed left-0 right-0 top-0 z-50 bg-background/95 p-4 backdrop-blur-sm">
    <div class="mx-auto max-w-4xl">
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
        />
        <Input.Root
          type="text"
          placeholder="Search messages..."
          class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-10 text-sm sm:text-base"
          bind:value={searchTerm}
        />
        {#if searchTerm}
          <button
            class="absolute right-3 top-1/2 -translate-y-1/2 transform"
            onclick={() => (searchTerm = "")}
          >
            <X class="h-4 w-4 text-muted-foreground" />
          </button>
        {/if}
      </div>
    </div>
  </div>

  <div class="mt-16">
    <Button.Root variant="ghost" class="group" onclick={() => history.back()}>
      <ArrowLeft class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span>Back</span>
    </Button.Root>

    <Card.Root class="mb-4 w-full border-0 bg-background/50 shadow-sm backdrop-blur-sm sm:mb-6">
      <Card.Header class="p-3 sm:p-4">
        <div class="flex w-full items-center justify-between gap-2">
          <div class="flex min-w-0 items-center">
            <MessageCircle class="mr-2 h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />
            <Card.Title class="truncate text-base font-medium sm:text-lg"
              >{data.res.title.slice(0, -7)}</Card.Title
            >
          </div>
          <Card.Description class="flex flex-shrink-0 items-center text-xs text-muted-foreground">
            <Clock class="mr-1 h-3 w-3" />
            {new Date(data.res.createdAt).toLocaleDateString()}
          </Card.Description>
        </div>
      </Card.Header>
    </Card.Root>

    <div class="space-y-4 sm:space-y-6">
      {#each [...filteredEntries] as entry}
        <div class={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            class={`max-w-[85%] sm:max-w-[75%] ${entry.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              class="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm"
            >
              <span>{entry.role === "user" ? "You" : "Miruhane"}</span>
              <span class="text-2xs opacity-75">•</span>
              <span class="text-2xs opacity-75"
                >{new Date(entry.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</span
              >
            </div>
            <div
              class={`rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 ${
                entry.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/30"
              }`}
            >
              <div class="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
                {#each highlightText( entry.content, searchTerm
                    .toLowerCase()
                    .split(/\s+/)
                    .filter((term) => term.length > 0), ) as part}
                  {#if part.highlight}
                    <mark class="bg-primary/30 dark:bg-primary/80">
                      {part.text}
                    </mark>
                  {:else}
                    {part.text}
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if hasMore}
      <div class="mt-6 flex justify-center sm:mt-8">
        <Button.Root
          variant="outline"
          class="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
          disabled={loading}
          onclick={loadMoreMessages}
        >
          {loading ? "Loading..." : "Load More Messages"}
        </Button.Root>
      </div>
    {/if}
  </div>
</div>
