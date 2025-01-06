<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import Share from "lucide-svelte/icons/share";
  import Trash2 from "lucide-svelte/icons/trash-2";
  import { Edit, Archive, Clock } from "lucide-svelte";

  let {
    projects,
  }: {
    projects: {
      name: string;
      url: string;
      // This should be `Component` after lucide-svelte updates types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon?: any;
    }[];
  } = $props();

  const sidebar = useSidebar();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
  <Sidebar.GroupLabel>
    <Clock class="h-6 w-6" />
    <span class="ml-2 text-lg font-medium"> History </span>
  </Sidebar.GroupLabel>
  <Sidebar.Menu class="space-y-0.75 pt-1">
    {#each projects as item (item.name)}
      <Sidebar.MenuItem class="rounded-lg hover:bg-white/10">
        <Sidebar.MenuButton>
          {#snippet child({ props })}
            <a href={item.url} {...props}>
              {#if item.icon}
                <item.icon />
              {/if}
              <span>{item.name}</span>
            </a>
          {/snippet}
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
            <DropdownMenu.Item>
              <Edit class="text-muted-foreground" />
              <span>Rename</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Archive class="text-muted-foreground" />
              <span>Archive</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
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
