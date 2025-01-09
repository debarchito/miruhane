<script lang="ts">
  import NavMain from "$lib/components/custom/nav-main.svelte";
  import NavUser from "$lib/components/custom/nav-user.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import {
    BookOpen,
    Bot,
    ChartPie,
    Frame,
    Map,
    Settings2,
    Sparkles,
    History,
    Speech,
    PenLine,
  } from "lucide-svelte";

  let { ref = $bindable(null), ...restProps } = $props();
  const sttModels = [
    { value: "stt-web", label: "Browser built-in" },
    { value: "stt-wt", label: "Whisper Tiny" },
    { value: "stt-ws", label: "Whisper Base" },
  ];
  const ttsModels = [
    { value: "tts-wt", label: "Whisper Tiny" },
    { value: "tts-ws", label: "Whisper Base" },
  ];
  let sttModel = $state("");
  let ttsModel = $state("");
  const sttTriggerContent = $derived(
    sttModels.find((f) => f.value === sttModel)?.label ?? "Select",
  );
  const ttsTriggerContent = $derived(
    sttModels.find((f) => f.value === ttsModel)?.label ?? "Select",
  );

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
    <Sidebar.Group>
      <Sidebar.GroupLabel><PenLine class="mr-2" /> STT Model</Sidebar.GroupLabel>
      <Sidebar.Menu>
        <Select.Root type="single" bind:value={sttModel}>
          <Select.Trigger class="w-[180px]">
            {sttTriggerContent}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each sttModels as model}
                <Select.Item value={model.value} label={model.label}>{model.label}</Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Sidebar.Menu>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel><Speech class="mr-2" /> TTS Model</Sidebar.GroupLabel>
      <Sidebar.Menu>
        <Select.Root type="single" bind:value={ttsModel}>
          <Select.Trigger class="w-[180px]">
            {ttsTriggerContent}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each ttsModels as model}
                <Select.Item value={model.value} label={model.label}>{model.label}</Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Sidebar.Menu>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser user={data.user} />
  </Sidebar.Footer>
</Sidebar.Root>
