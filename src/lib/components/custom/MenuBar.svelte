<script lang="ts">
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import { setMode, mode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button";
  import * as Menubar from "$lib/components/ui/menubar";
  import { Settings, Moon, Sun, User, LogIn, UserPlus, ChevronDown } from "lucide-svelte";

  let isMenuOpen = $state(false);

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  const commonButtonClasses =
    "flex items-center space-x-2 rounded-lg border border-border/50 bg-background/30 backdrop-blur-3xl transition-all duration-200 hover:scale-[1.02] hover:bg-background/40 hover:text-primary hover:shadow-md";
  const commonIconClasses = "h-4 w-4";
  const commonMenuTriggerClasses =
    "cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:rounded-lg hover:bg-background/40 hover:text-primary hover:shadow-md";
</script>

<div class="fixed top-0 z-50 w-full">
  <nav aria-label="Desktop navigation">
    <Menubar.Root
      class="hidden rounded-none border-b border-none bg-background/20 px-2 backdrop-blur-3xl md:flex lg:px-4"
    >
      <Menubar.Menu>
        <Menubar.Trigger class="font-bold">
          <a href="/" aria-label="Home">Miruhane.</a>
        </Menubar.Trigger>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger
          onclick={() => setMode($mode === "dark" ? "light" : "dark")}
          class={commonMenuTriggerClasses}
          aria-label="Toggle theme"
        >
          {#if $mode === "dark"}
            <Sun class={commonIconClasses} aria-hidden="true" />
          {:else}
            <Moon class={commonIconClasses} aria-hidden="true" />
          {/if}
        </Menubar.Trigger>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger class={commonMenuTriggerClasses} aria-label="User menu">
          <User class={commonIconClasses} aria-hidden="true" />
        </Menubar.Trigger>
        <Menubar.Content class="border-none bg-background/20 backdrop-blur-3xl">
          <Menubar.Item
            class="rounded-lg bg-transparent backdrop-blur-xl hover:bg-background/30 hover:text-primary"
          >
            <a href="/sign-up" class="flex items-center">
              <UserPlus class="mr-2 h-4 w-4" aria-hidden="true" />
              Sign Up
            </a>
          </Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item
            class="rounded-lg bg-transparent backdrop-blur-xl hover:bg-background/30 hover:text-primary"
          >
            <a href="/sign-in" class="flex items-center">
              <LogIn class="mr-2 h-4 w-4" aria-hidden="true" />
              Sign In
            </a>
          </Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger class={commonMenuTriggerClasses}>
          <a href="/settings" aria-label="Settings">
            <Settings class={commonIconClasses} aria-hidden="true" />
          </a>
        </Menubar.Trigger>
      </Menubar.Menu>
    </Menubar.Root>
  </nav>

  <nav aria-label="Mobile navigation">
    <div
      class="flex items-center justify-between bg-background/20 px-4 py-2 backdrop-blur-3xl md:hidden"
    >
      <a href="/" class="font-bold" aria-label="Home">Miruhane.</a>

      <Button
        variant="ghost"
        size="icon"
        onclick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
      >
        <ChevronDown
          class="h-5 w-5 transition-transform duration-200 {isMenuOpen ? 'rotate-180' : ''}"
          aria-hidden="true"
        />
      </Button>
    </div>

    {#if isMenuOpen}
      <div
        id="mobile-menu"
        class="absolute left-0 top-[calc(100%-1px)] w-full space-y-4 border-b bg-background/20 p-4 shadow-lg backdrop-blur-3xl md:hidden"
        transition:slide={{ duration: 200, easing: quintOut }}
      >
        <div class="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            class={commonButtonClasses}
            onclick={() => setMode($mode === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {#if $mode === "dark"}
              <Sun class={commonIconClasses} aria-hidden="true" />
            {:else}
              <Moon class={commonIconClasses} aria-hidden="true" />
            {/if}
            <span>Theme</span>
          </Button>
          <Button
            variant="ghost"
            href="/settings"
            class={commonButtonClasses}
            aria-label="Settings"
          >
            <Settings class={commonIconClasses} aria-hidden="true" />
            <span>Settings</span>
          </Button>
          <Button variant="ghost" href="/sign-up" class={commonButtonClasses}>
            <UserPlus class={commonIconClasses} aria-hidden="true" />
            <span>Sign Up</span>
          </Button>
          <Button variant="ghost" href="/sign-in" class={commonButtonClasses}>
            <LogIn class={commonIconClasses} aria-hidden="true" />
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    {/if}
  </nav>
</div>
