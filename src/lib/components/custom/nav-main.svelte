<script lang="ts">
  import { history } from "$lib/runes.svelte.js";
  import { ChevronRight, ArrowUpRight } from "lucide-svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";

  let {
    items,
  }: {
    items: {
      title: string;
      url: string;
      // Icon can be anything, we don't care about it here
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: any;
      isActive?: boolean;
      items?: typeof history.get;
    }[];
  } = $props();
</script>

<Sidebar.Group>
  <Sidebar.Menu>
    {#each items as mainItem (mainItem.title)}
      <Collapsible.Root open={mainItem.isActive}>
        {#snippet child({ props })}
          <Sidebar.MenuItem {...props}>
            <Sidebar.MenuButton>
              {#snippet tooltipContent()}
                {mainItem.title}
              {/snippet}
              {#snippet child({ props })}
                <a href={mainItem.url} {...props}>
                  <mainItem.icon />
                  <span>{mainItem.title}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
            {#if mainItem.items?.length}
              <Collapsible.Trigger>
                {#snippet child({ props })}
                  <Sidebar.MenuAction {...props} class="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span class="sr-only">Toggle</span>
                  </Sidebar.MenuAction>
                {/snippet}
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Sidebar.MenuSub>
                  {#each mainItem.items as subItem (subItem.title)}
                    <Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton href="/history/{subItem.id}">
                        <ArrowUpRight />
                        <span>{subItem.title}</span>
                      </Sidebar.MenuSubButton>
                    </Sidebar.MenuSubItem>
                  {/each}
                </Sidebar.MenuSub>
              </Collapsible.Content>
            {/if}
          </Sidebar.MenuItem>
        {/snippet}
      </Collapsible.Root>
    {/each}
  </Sidebar.Menu>
</Sidebar.Group>
