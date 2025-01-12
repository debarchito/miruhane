<script lang="ts">
  import { Clock } from "lucide-svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  let {
    transcriptionHistory = $bindable(),
    currentHistoryId = $bindable(),
  }: {
    transcriptionHistory: {
      author: string;
      text: string;
      timestamp: Date;
    }[];
    currentHistoryId: string | null;
  } = $props();
</script>

<Sheet.Root>
  <Sheet.Trigger
    class="transition-all hover:scale-105 active:scale-95 {buttonVariants({
      variant: 'outline',
    })}"
  >
    <Clock class="h-4 w-4" />
  </Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Instant History</Sheet.Title>
      <Sheet.Description class="text-muted-foreground">
        Click <a class="text-primary" href="/history/{currentHistoryId}"> here </a> to view full history.
      </Sheet.Description>
    </Sheet.Header>
    <div class="max-h-[80vh] overflow-y-auto px-2 sm:px-4">
      {#each transcriptionHistory as record}
        <div
          class="shadow-xs my-2 rounded-lg border p-3 transition-all hover:shadow-sm sm:my-4 sm:p-6 {record.author ===
          'user'
            ? 'ml-auto mr-2 w-[80%]'
            : 'ml-2 mr-auto w-[80%]'}"
        >
          <time class="mb-1 block text-xs font-normal text-muted-foreground sm:mb-2 sm:text-sm">
            {record.timestamp.toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
          <p class="text-base leading-relaxed">{record.text}</p>
        </div>
      {/each}
    </div>
  </Sheet.Content>
</Sheet.Root>
