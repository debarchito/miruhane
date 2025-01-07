<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import Share from "lucide-svelte/icons/share";
  import Trash2 from "lucide-svelte/icons/trash-2";
  import { Edit, Archive, Clock } from "lucide-svelte";

  let {
    histories,
  }: {
    histories: {
      name: string;
      description: string;
      url: string;
      // This should be `Component` after lucide-svelte updates types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isEditing?: boolean; // Added flag for editing state
    }[];
  } = $props();

  // Initialize isEditing for each history item
  histories = histories.map((history) => ({
    ...history,
    isEditing: false, // Add isEditing property to each item
  }));

  const sidebar = useSidebar();

  function deleteHistory(item: { name: string; url: string }) {
    histories = histories.filter((history) => history.url !== item.url);
  }

  function startEditing(item: { name: string; url: string }) {
    histories = histories.map((history) =>
      history.url === item.url ? { ...history, isEditing: true } : history,
    );
  }

  function stopEditing(item: { name: string; url: string }) {
    histories = histories.map((history) =>
      history.url === item.url ? { ...history, isEditing: false } : history,
    );
  }
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
  <Sidebar.GroupLabel>
    <Clock class="h-6 w-6" />
    <span class="ml-2 text-lg font-medium"> History </span>
  </Sidebar.GroupLabel>
  <Sidebar.Menu class="space-y-0.75 pt-1">
    {#each histories as item (item.name)}
      <Sidebar.MenuItem class="rounded-lg hover:bg-white/10">
        <Sidebar.MenuButton>
          {#if item.isEditing}
            <input
              type="text"
              class="w-full border-b border-white bg-transparent p-1 text-white outline-none"
              bind:value={item.name}
              onblur={() => stopEditing(item)}
              onkeydown={(e) => e.key === "Enter" && stopEditing(item)}
            />
          {:else}
            <a href={item.url}>
              <span>{item.name}</span>
            </a>
          {/if}
        </Sidebar.MenuButton>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuAction showOnHover {...props}>
                <Ellipsis />
                <span class="sr-only">More</span>
              </Sidebar.MenuAction>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            class="w-40 space-y-2 p-2"
            side={sidebar.isMobile ? "bottom" : "right"}
            align={sidebar.isMobile ? "end" : "start"}
          >
            <DropdownMenu.Item>
              <Share class="text-muted-foreground" />
              <span>Share</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => startEditing(item)}>
              <Edit class="text-muted-foreground" />
              <span>Rename</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Archive class="text-muted-foreground" />
              <span>Archive</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onclick={() => deleteHistory(item)}>
              <Trash2 class="text-red-500" />
              <span class="text-red-500">Delete</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    {/each}
    <Sidebar.MenuItem>
      <Sidebar.MenuButton>
        <Ellipsis />
        <span>More</span>
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  </Sidebar.Menu>
</Sidebar.Group>
