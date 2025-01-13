<script lang="ts">
  import type { PageData } from "./$types";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import * as Input from "$lib/components/ui/input/index.js";
  import { ArrowLeft, ArrowRight, Clock, MessageCircle, Search, X, Trash2 } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
  let initialHistoryLog = $state(data.history);
  let searchTerm = $state("");
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

  const filteredHistory = $derived(
    initialHistoryLog.filter((entry) => {
      const title = entry.title.toLowerCase();
      const terms = searchTerm
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 0);
      return terms.length === 0 || terms.every((term) => title.includes(term));
    }),
  );

  async function deleteHistoryEntry(id: string) {
    const response = await fetch("/api/history/delete", {
      method: "POST",
      body: JSON.stringify({ historyId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      initialHistoryLog.splice(
        initialHistoryLog.findIndex((entry) => entry.id === id),
        1,
      );
    }
  }

  async function loadMore() {
    const lastEntry = initialHistoryLog[initialHistoryLog.length - 1];
    const body = await fetch("/api/history/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cursor: new Date(lastEntry.createdAt),
        pageSize: 10,
        direction: "next",
        order: "desc",
      }),
    });
    const res = await body.json();
    initialHistoryLog = [...initialHistoryLog, ...res.res];
    hasMore = res.meta.hasMore;
  }
</script>

<svelte:head>
  <title>History | miruhane.</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-background to-secondary/10">
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 flex items-center justify-between">
      <Button.Root variant="ghost" class="group" onclick={() => history.back()}>
        <ArrowLeft class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </Button.Root>

      <div class="relative w-64">
        <Search
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
        />
        <Input.Root
          type="text"
          placeholder="Search history..."
          class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-10 text-sm"
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

    {#if filteredHistory.length === 0}
      <div class="flex h-[50vh] items-center justify-center">
        <p class="text-lg text-muted-foreground">No history found</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each filteredHistory as historyEntry}
          <Card.Root
            class="overflow-hidden border-l-4 border-l-primary/50 bg-background transition-all duration-300 hover:border-l-primary"
          >
            <div class="flex items-center justify-between p-4 sm:p-6">
              <div class="space-y-2">
                <div class="flex items-center space-x-3">
                  <MessageCircle class="h-5 w-5 text-primary" />
                  <h2 class="text-lg font-semibold tracking-tight">
                    {#each highlightText( historyEntry.title.slice(0, -7), searchTerm
                        .toLowerCase()
                        .split(/\s+/)
                        .filter((term) => term.length > 0), ) as part}
                      {#if part.highlight}
                        <mark class="bg-primary/30 dark:bg-primary/80 dark:text-white">
                          {part.text}
                        </mark>
                      {:else}
                        {part.text}
                      {/if}
                    {/each}
                  </h2>
                </div>
                <div class="flex items-center text-sm text-muted-foreground">
                  <Clock class="mr-2 h-4 w-4" />
                  <time datetime={new Date(historyEntry.updatedAt).toISOString()}>
                    {new Date(historyEntry.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Button.Root variant="ghost" size="sm" class="group">
                  <button
                    onclick={() => deleteHistoryEntry(historyEntry.id)}
                    class="text-destructive"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </Button.Root>

                <Button.Root variant="ghost" size="sm" class="group">
                  <a href="/history/{historyEntry.id}" class="flex items-center">
                    View
                    <ArrowRight
                      class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </Button.Root>
              </div>
            </div>
          </Card.Root>
        {/each}

        {#if hasMore}
          <div class="mt-8 flex justify-center">
            <Button.Root variant="outline" class="w-full max-w-xs" onclick={loadMore}
              >Load More</Button.Root
            >
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
