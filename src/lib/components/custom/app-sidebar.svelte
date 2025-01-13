<script lang="ts">
  import { settings, history } from "$lib/runes.svelte.js";
  import NavMain from "$lib/components/custom/nav-main.svelte";
  import NavUser from "$lib/components/custom/nav-user.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Sparkles, History, Speech, PenLine, BrainCircuit } from "lucide-svelte";

  let { ref = $bindable(null), ...restProps } = $props();

  const sttModels = [
    { value: "browser", label: "Browser built-in" },
    { value: "model:whisper-tiny", label: "Whisper Tiny" },
    { value: "model:whisper-base", label: "Whisper Base" },
  ];
  const ttsModels = [
    { value: "browser", label: "Browser built-in" },
    { value: "service:speechify", label: "Speechify" },
  ];
  const contextModels = [{ value: "model:gemini-1.5-flash", label: "Gemini 1.5 Flash" }];

  let sttModel = $state(settings.getKeyValue("model-stt"));
  let ttsModel = $state(settings.getKeyValue("model-tts"));
  let contextModel = $state(settings.getKeyValue("model-context"));
  let hasChanges = $state(false);

  const sttTriggerContent = $derived(
    sttModels.find((f) => f.value === sttModel)?.label ?? "Select",
  );
  const ttsTriggerContent = $derived(
    ttsModels.find((f) => f.value === ttsModel)?.label ?? "Select",
  );
  const contextTriggerContent = $derived(
    contextModels.find((f) => f.value === contextModel)?.label ?? "Select",
  );

  function handleSave() {
    settings.set([
      ...settings.get.filter((s) => !["model-stt", "model-tts", "model-context"].includes(s.key)),
      { key: "model-stt", value: sttModel },
      { key: "model-tts", value: ttsModel },
      { key: "model-context", value: contextModel },
    ]);
    fetch("/api/settings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings.diff),
    });
    hasChanges = false;
  }

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
        items: history.get,
      },
    ],
  };
</script>

<Sidebar.Root variant="inset" bind:ref {...restProps}>
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
      <Sidebar.GroupLabel><PenLine class="mr-2" /> STT Backend</Sidebar.GroupLabel>
      <Sidebar.Menu>
        <Select.Root type="single" bind:value={sttModel} onValueChange={() => (hasChanges = true)}>
          <Select.Trigger class="w-[180px]">{sttTriggerContent}</Select.Trigger>
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
      <Sidebar.GroupLabel><BrainCircuit class="mr-2" /> Context Backend</Sidebar.GroupLabel>
      <Sidebar.Menu>
        <Select.Root
          type="single"
          bind:value={contextModel}
          onValueChange={() => (hasChanges = true)}
        >
          <Select.Trigger class="w-[180px]">{contextTriggerContent}</Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each contextModels as model}
                <Select.Item value={model.value} label={model.label}>{model.label}</Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Sidebar.Menu>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel><Speech class="mr-2" /> TTS Backend</Sidebar.GroupLabel>
      <Sidebar.Menu>
        <Select.Root type="single" bind:value={ttsModel} onValueChange={() => (hasChanges = true)}>
          <Select.Trigger class="w-[180px]">{ttsTriggerContent}</Select.Trigger>
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
    {#if hasChanges}
      <Sidebar.Group>
        <Button.Root onclick={handleSave} variant="outline" class="w-full">Save Changes</Button.Root
        >
      </Sidebar.Group>
    {/if}
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser user={data.user} />
  </Sidebar.Footer>
</Sidebar.Root>
