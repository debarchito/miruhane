<script lang="ts">
  import * as Button from "$lib/components/ui/button/index.js";
  import * as Input from "$lib/components/ui/input/index.js";
  import { Send, MessageCircle, ArrowLeft } from "lucide-svelte";

  let isChatOpen: boolean = $state(false);
  let currentMessage: string = $state("");

  let messageFeed: { id: number; sender: "bot" | "user"; text: string; timestamp: string }[] =
    $state([
      {
        id: 0,
        sender: "bot",
        text: "Hey there! Please give me a moment while I pull up our chat system.",
        timestamp: "2:30 PM",
      },
      {
        id: 1,
        sender: "user",
        text: "No problem! Take your time :)",
        timestamp: "2:35 PM",
      },
    ]);

  function toggleChat(): void {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      setTimeout(() => {
        scrollChatBottom();
      }, 1);
    }
  }

  function addMessage(): void {
    if (currentMessage.trim() !== "") {
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

      messageFeed = [...messageFeed, newMessage];
      currentMessage = "";
      scrollChatBottom();
    }
  }

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
  class="overflow-hiddenborder fixed bottom-5 right-5 cursor-pointer p-4 shadow-xl transition-all active:scale-95"
  onclick={toggleChat}
>
  <MessageCircle class="h-6 w-6" />
  Super Chat
</Button.Root>

{#if isChatOpen}
  <div
    class="fixed inset-0 z-40 flex flex-col overflow-hidden rounded-2xl bg-background shadow-2xl"
  >
    <div class="flex items-center justify-between border-b border-primary/10 bg-background p-4">
      <Button.Root variant="ghost" class="group" onclick={toggleChat}>
        <ArrowLeft class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </Button.Root>
      <div class="w-8"></div>
    </div>

    <div class="flex flex-col items-center justify-center gap-2 p-6">
      <div
        class="w-full max-w-3xl rounded-lg border border-primary/20 bg-primary/10 p-4 shadow-lg backdrop-blur-lg"
      >
        <div class="mb-2 text-xl font-semibold text-primary">Super Chat 🚧</div>
        <p class="text-muted-foreground">
          This experimental feature is currently under construction. Soon you'll be able to review
          and analyze your entire conversation history in one place!
        </p>
      </div>
    </div>

    <div class="flex-1 space-y-4 overflow-y-auto p-6" bind:this={chatContainer}>
      {#each messageFeed as { sender, text, timestamp, id }}
        <div
          class={`flex ${sender === "bot" ? "justify-start" : "justify-end"}`}
          id={id.toString()}
        >
          <div class={`max-w-[75%] break-words rounded-lg px-4 py-2`}>
            <div class="pb-1 text-sm text-gray-400">
              {sender === "bot" ? "Miruhane • " : "You • "}
              {timestamp}
            </div>
            <div
              class={`rounded-2xl p-4 ${sender === "bot" ? "bg-secondary" : "bg-primary text-primary-foreground"} shadow-lg`}
            >
              {text}
            </div>
          </div>
        </div>
      {/each}
    </div>
    <div class="border-t border-primary/10 bg-background p-4">
      <div class="flex items-center gap-3">
        <Input.Root
          type="text"
          class="flex-grow border border-primary/20 bg-background px-6 py-3 shadow-inner placeholder:text-gray-400 focus:border-primary/40 focus:outline-none focus:ring-0"
          placeholder="Write a message..."
          bind:value={currentMessage}
          onkeydown={handleKeyPress}
        />
        <Button.Root
          variant="outline"
          class="flex cursor-pointer items-center justify-center overflow-hidden border border-primary/20 bg-primary p-3 shadow-lg transition-all hover:border-primary/40 hover:bg-primary active:scale-95"
          onclick={addMessage}
        >
          <Send class="h-5 w-5 text-primary-foreground" />
        </Button.Root>
      </div>
    </div>
  </div>
{/if}
