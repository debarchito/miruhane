<script lang="ts">
  import * as Button from "$lib/components/ui/button/index.js";
  import { Send, PlusCircle, ArrowLeft } from "lucide-svelte";

  // State for controlling chat window visibility
  let isChatOpen: boolean = $state(false);

  // State for the current message and message feed
  let currentMessage: string = $state("");
  let messageFeed: { id: number; sender: "bot" | "user"; text: string; timestamp: string }[] =
    $state([
      {
        id: 0,
        sender: "bot",
        text: "Hello, how can I assist you today?",
        timestamp: "2:30 PM",
      },
      {
        id: 1,
        sender: "user",
        text: "I need help with my order.",
        timestamp: "2:35 PM",
      },
    ]);

  // Toggle chat visibility
  function toggleChat(): void {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      setTimeout(() => {
        scrollChatBottom();
      }, 1);
    }
  }

  // Add a new message to the message feed
  function addMessage(): void {
    if (currentMessage.trim() !== "") {
      // Create a new message object
      const newMessage: { id: number; sender: "user" | "bot"; text: string; timestamp: string } = {
        id: messageFeed.length,
        sender: "user",
        text: currentMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };

      // Add the new message to the feed
      messageFeed = [...messageFeed, newMessage];

      // Clear the input field
      currentMessage = "";

      // Smoothly scroll to the bottom of the chat feed
      setTimeout(() => {
        scrollChatBottom();
      }, 0);
    }
  }

  // Scroll to the bottom of the chat window
  let chatContainer: HTMLElement | null = $state(null);
  function scrollChatBottom(): void {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  function handleKeyPress(event: KeyboardEvent): void {
    if (event.key === "Enter" && currentMessage.trim() !== "") {
      addMessage();
    }
  }
</script>

<Button.Root
  variant="outline"
  class="fixed bottom-5 right-5 cursor-pointer overflow-hidden rounded-full border border-primary/20 bg-primary/10 px-4 py-6 shadow-lg backdrop-blur-sm transition-all before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-tr before:from-primary/10 before:via-transparent before:to-primary/10 hover:scale-105 active:scale-95"
  onclick={toggleChat}
>
  <PlusCircle />
</Button.Root>

{#if isChatOpen}
  <div class="fixed inset-0 z-40 flex flex-col overflow-hidden rounded-2xl bg-background shadow-lg">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between rounded-t-2xl bg-transparent p-4 text-white">
      <Button.Root variant="ghost" class="mb-4 hover:bg-white/5 sm:mb-6" onclick={toggleChat}>
        <ArrowLeft class="mr-2 h-4 w-4" />
        <span class="hidden sm:inline">Back</span>
      </Button.Root>
      <span class="text-lg font-semibold">History Chat</span>
      <div class="w-8"></div>
    </div>

    <!-- Chat message container -->
    <div class="flex-1 space-y-4 overflow-y-auto p-6" bind:this={chatContainer}>
      {#each messageFeed as { sender, text, timestamp, id }}
        <div
          class={`flex ${sender === "bot" ? "justify-start" : "justify-end"}`}
          id={id.toString()}
        >
          <div class={`max-w-[75%] break-words rounded-lg px-4 py-2`}>
            <div class="pb-1 text-sm text-gray-400">
                {sender === "bot" ? "Miruhane • " : "You • "} {timestamp}
            </div>
            <div
              class={`rounded-2xl p-4 ${sender === "bot" ? "bg-secondary/30" : "bg-primary text-primary-foreground"} shadow-lg`}
            >
              {text}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Chat input area, fixed at the bottom -->
    <div class="flex items-center justify-between p-4">
      <input
        type="text"
        class="mr-3 flex-grow rounded-3xl border border-gray-500 bg-transparent p-3 placeholder:text-gray-400 focus:outline-none"
        placeholder="Write a message..."
        bind:value={currentMessage}
        onkeydown={handleKeyPress}
      />
      <Button.Root
        variant="outline"
        class="ml-3 flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
        onclick={addMessage}
      >
        <Send class="h-6 w-6 text-white" />
      </Button.Root>
    </div>
  </div>
{/if}
