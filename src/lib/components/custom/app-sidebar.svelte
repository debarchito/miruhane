<script lang="ts">
  import NavMain from "$lib/components/custom/nav-main.svelte";
  import NavUser from "$lib/components/custom/nav-user.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import NavProjects from "$lib/components/custom/nav-projects.svelte";
  import { BookOpen, Bot, ChartPie, Frame, Map, Settings2, Sparkles, History } from "lucide-svelte";

  let { ref = $bindable(null), ...restProps } = $props();

  const data = {
    user: {
      name: restProps.username,
      email: restProps.email,
      avatar: "",
    },
    navMain: [
      {
        title: "History",
        url: "/history",
        icon: History,
        isActive: true,
        items: [
          {
            title: "How far does it go? Does it go over the top?",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
          {
            title: "... more",
            url: "/history",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: ChartPie,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg">
          {#snippet child({ props })}
            <a href="##" {...props}>
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <Sparkles class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">miruhane.</span>
                <span class="truncate text-xs">@aurialis</span>
              </div>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain items={data.navMain} />
    <NavProjects projects={data.projects} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser user={data.user} />
  </Sidebar.Footer>
</Sidebar.Root>
