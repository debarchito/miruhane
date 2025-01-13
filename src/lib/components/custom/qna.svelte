<script lang="ts">
  import * as Input from "$lib/components/ui/input/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import { Send, ArrowLeft, MessagesSquare, Paperclip, Smile, Image } from "lucide-svelte";

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
  class="fixed bottom-5 right-5 cursor-pointer overflow-hidden border border-primary/30 bg-primary/20 p-4 shadow-xl backdrop-blur-lg transition-all hover:scale-110 hover:bg-primary/10 active:scale-95"
  onclick={toggleChat}
>
  <MessagesSquare class="h-6 w-6" />
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

    <div class="flex-1 space-y-4 overflow-y-auto p-6" bind:this={chatContainer}>
      <div class="flex flex-col items-center justify-center gap-2 p-6">
        <div
          class="w-full max-w-3xl rounded-lg border border-primary/20 bg-primary/10 p-4 shadow-lg backdrop-blur-lg"
        >
          <div class="mb-2 text-xl font-semibold text-primary">
            Super Chat <div
              class="inline-flex items-center justify-center gap-1 rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-sm font-medium text-primary"
            >
              <span>Under Construction</span>
              🚧
            </div>
          </div>
          <p class="text-muted-foreground">
            This experimental feature is currently under construction. Soon you'll be able to review
            and analyze your entire conversation history in one place!
          </p>
        </div>
      </div>

      {#each messageFeed as { sender, text, timestamp, id }}
        <div
          class={`flex ${sender === "bot" ? "justify-start" : "justify-end"}`}
          id={id.toString()}
        >
          <div class={`max-w-[75%] break-words rounded-lg px-4 py-2`}>
            <div class="pb-1 text-sm text-gray-400">
              {sender === "bot" ? "Support • " : "You • "}
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
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <Button.Root variant="ghost" class="h-10 w-10 p-2">
            <Paperclip class="h-5 w-5 text-primary/60" />
          </Button.Root>
          <Button.Root variant="ghost" class="h-10 w-10 p-2">
            <Image class="h-5 w-5 text-primary/60" />
          </Button.Root>
          <Button.Root variant="ghost" class="h-10 w-10 p-2">
            <Smile class="h-5 w-5 text-primary/60" />
          </Button.Root>
        </div>
        <div class="relative flex gap-2">
          <div class="relative flex-1">
            <Input.Root
              type="text"
              class="w-full border border-primary/20 bg-background/80 px-6 py-3 shadow-inner backdrop-blur placeholder:text-gray-400 focus:border-primary/40 focus:outline-none focus:ring-0"
              placeholder="Type your message..."
              bind:value={currentMessage}
              onkeydown={handleKeyPress}
            />
            {#if currentMessage.trim() !== ""}
              <Button.Root
                variant="outline"
                class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center overflow-hidden border border-primary/20 bg-primary/10 transition-all hover:bg-primary/20"
                onclick={addMessage}
              >
                <Send class="h-4 w-4 text-primary/60" />
              </Button.Root>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
