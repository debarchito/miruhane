<script lang="ts">
  import { X, Play, Clock, Pause, Check, MessageSquarePlus } from "lucide-svelte";
  import AppSidebar from "$lib/components/custom/app-sidebar.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

  // Props and state management
  let { data } = $props();
  let isStarted = $state(false);
  let isPaused = $state(false);
  let transcription = $state("");
  let conversationResult = $state("");
  let isLoading = $state(false);
  let isNextStageRunning = $state(false);
  let mediaRecorder: MediaRecorder;
  let timer = $state(30);
  let transcriptionHistory = $state<{ text: string; timestamp: Date }[]>([]);
  let showHistory = $state(false);
  let timerInterval: ReturnType<typeof setInterval>;
  let audioChunks: BlobPart[] = [];

  // Recording functionality
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.start(100);
      isStarted = true;
      isPaused = false;
      isNextStageRunning = false;

      timer = 30;
      timerInterval = setInterval(() => {
        if (!isPaused) {
          timer--;
          if (timer <= 0) {
            void stopRecording(true);
            timer = 30;
          }
        }
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  }

  function resetState() {
    isStarted = false;
    isPaused = false;
    transcription = "";
    conversationResult = "";
    isLoading = false;
    isNextStageRunning = false;
    audioChunks = [];
    clearInterval(timerInterval);
    timer = 30;

    if (mediaRecorder?.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }

  function pauseRecording() {
    if (!mediaRecorder) return;

    if (mediaRecorder.state === "recording") {
      mediaRecorder.requestData();
      mediaRecorder.pause();
      isPaused = true;
    } else if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      isPaused = false;
    }
  }

  async function stopRecording(shouldProcess = true) {
    clearInterval(timerInterval);
    timer = 30;

    if (!mediaRecorder || !["recording", "paused"].includes(mediaRecorder.state)) {
      return;
    }

    if (mediaRecorder.state === "recording") {
      mediaRecorder.requestData();
    }

    mediaRecorder.stop();
    await new Promise((resolve) => {
      mediaRecorder.addEventListener("stop", resolve, { once: true });
    });
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());

    if (shouldProcess) {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioFD = new FormData();
      const contextFD = new FormData();
      audioFD.append("audio", audioBlob);

      isLoading = true;
      try {
        const inferRes = await fetch("/api/infer", {
          method: "POST",
          body: audioFD,
        });
        const infered = await inferRes.json();

        transcription = infered.text.text;
        transcriptionHistory = [
          ...transcriptionHistory,
          {
            text: infered.text.text,
            timestamp: new Date(),
          },
        ];

        contextFD.append("context", infered.text.text);
        const genRes = await fetch("/api/gen", {
          method: "POST",
          body: contextFD,
        });
        const generated = await genRes.json();
        conversationResult = generated.text;
        isNextStageRunning = true;
      } catch (err) {
        console.error("Error processing audio:", err);
      } finally {
        isLoading = false;
        audioChunks = [];
        void startRecording();
      }
    } else {
      resetState();
    }

    audioChunks = [];
  }
</script>

<svelte:head>
  <title>Chat | miruhane.</title>
  <meta
    name="description"
    content="Professional chat interface with voice recognition capabilities"
  />
</svelte:head>

<Sidebar.Provider>
  <AppSidebar username={data.user.username} email={data.user.email} />
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2 border-b border-primary/10">
      <div class="flex w-full items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item class="hidden md:block">
              <Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="hidden md:block" />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Voice Chat</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </header>

    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div
        class="flex min-h-[calc(100vh-6rem)] flex-1 flex-col items-center justify-center rounded-xl backdrop-blur-lg md:min-h-[calc(100vh-8rem)]"
      >
        <div
          class="{isStarted
            ? 'grid grid-cols-1 items-center gap-4 md:grid-cols-2'
            : ''} mx-auto w-full max-w-7xl transition-all duration-500"
        >
          <div class="flex flex-col items-center justify-center p-4">
            <div class="relative h-24 w-24 md:h-32 md:w-32">
              <div
                class:animate-[pulse_1.2s_ease-in-out_infinite]={isStarted && !isPaused}
                class="absolute inset-0 rounded-full border-4 border-primary/80 shadow-xl shadow-primary/30 backdrop-blur-sm"
                style="animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);"
              ></div>
              <div
                class:animate-[spin_2s_linear_infinite]={isStarted && !isPaused}
                class="animate-reverse absolute inset-2 rounded-full border-4 border-primary/60 shadow-xl shadow-primary/30 backdrop-blur-sm"
                style="animation-direction: reverse;"
              >
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent"
                ></div>
              </div>
              <div
                class:animate-[spin_4s_linear_infinite]={isStarted && !isPaused}
                class="absolute inset-4 rounded-full border-4 border-primary/40 shadow-xl shadow-primary/30 backdrop-blur-sm"
              >
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-bl from-primary/20 to-transparent"
                ></div>
              </div>
              <div
                class:animate-[pulse_2s_ease-in-out_infinite]={isStarted && !isPaused}
                class="absolute inset-0 opacity-50"
              >
                <div
                  class="h-full w-full rounded-full bg-gradient-to-r from-primary via-transparent to-primary"
                >
                  <div
                    class="absolute inset-0 rounded-full bg-gradient-to-t from-primary/30 to-transparent blur-sm"
                  ></div>
                </div>
              </div>
              {#if isStarted && !isPaused}
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xl font-bold text-primary drop-shadow-lg">{timer}s</span>
                </div>
              {/if}
            </div>

            {#if isStarted}
              <div class="mt-8 flex flex-row gap-4 px-4 sm:mt-12 sm:scale-110 sm:gap-6">
                <Button.Root
                  variant="destructive"
                  onclick={resetState}
                  class="transition-all hover:scale-105 active:scale-95"
                >
                  <X class="h-4 w-4" />
                </Button.Root>
                <Button.Root
                  variant="outline"
                  onclick={pauseRecording}
                  class="transition-all hover:scale-105 active:scale-95"
                >
                  {#if isPaused}
                    <Play class="h-4 w-4" />
                  {:else}
                    <Pause class="h-4 w-4" />
                  {/if}
                </Button.Root>
                <Button.Root
                  variant="outline"
                  onclick={() => stopRecording(true)}
                  disabled={isLoading}
                  class="transition-all hover:scale-105 active:scale-95"
                >
                  {#if isLoading}
                    <div
                      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    ></div>
                  {:else}
                    <Check class="h-4 w-4" />
                  {/if}
                </Button.Root>
                {#if transcriptionHistory.length > 0}
                  <Button.Root
                    variant="outline"
                    onclick={() => (showHistory = !showHistory)}
                    class="transition-all hover:scale-105 active:scale-95"
                  >
                    {#if showHistory}
                      <X class="h-4 w-4" />
                    {:else}
                      <Clock class="h-4 w-4" />
                    {/if}
                  </Button.Root>
                {/if}
              </div>
            {:else}
              <Button.Root
                onclick={startRecording}
                variant="outline"
                class="mt-8 transition-all hover:scale-105 active:scale-95 sm:mt-12"
              >
                <MessageSquarePlus class="mr-2 h-4 w-4" />
                Start Conversation
              </Button.Root>
            {/if}
          </div>

          {#if isStarted}
            <div
              class="flex flex-col gap-4 p-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 md:p-8"
            >
              {#if showHistory && transcriptionHistory.length > 0}
                <div
                  class="mb-4 max-h-48 overflow-y-auto rounded-lg border border-primary/20 bg-black/40 p-4 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4"
                >
                  <h3 class="mb-4 text-sm font-medium uppercase tracking-wide text-primary/90">
                    History
                  </h3>
                  <div class="space-y-4">
                    {#each [...transcriptionHistory].reverse() as entry}
                      <div
                        class="rounded-lg border border-primary/20 bg-primary/5 p-3 transition-all duration-300 animate-in fade-in-50 slide-in-from-left-4 hover:bg-primary/10"
                      >
                        <p class="text-sm text-white/90">{entry.text}</p>
                        <div class="mt-2 flex items-center gap-2 text-xs text-primary/70">
                          <Clock class="h-3 w-3" />
                          <span>{entry.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
              <Card.Root
                class="relative overflow-hidden border border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-md"
              >
                <div
                  class="absolute inset-0 rounded-lg bg-gradient-to-tr from-primary/10 via-transparent to-primary/10"
                ></div>
                <Card.Header class="relative z-10">
                  <Card.Title
                    class="mb-2 text-sm font-medium uppercase tracking-wide text-primary/90"
                  >
                    Transcription
                  </Card.Title>
                  <Card.Description>
                    <div
                      class="relative text-base font-light leading-relaxed text-white/90 transition-opacity md:text-lg"
                    >
                      <div class="flex flex-col gap-2">
                        {#if transcription}
                          <span
                            class="text-primary animate-in fade-in slide-in-from-bottom-2 dark:text-white"
                          >
                            {transcription}
                          </span>
                        {/if}
                        <div class="mt-2">
                          {#if isLoading}
                            <div class="flex items-center gap-3">
                              <div
                                class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                              ></div>
                              <span class="text-sm text-primary/70">Processing audio...</span>
                            </div>
                          {:else if isPaused}
                            <div class="flex items-center gap-3">
                              <div class="h-4 w-4 rounded-full border-2 border-primary"></div>
                              <span class="text-sm text-primary/70">Paused</span>
                            </div>
                          {:else if isNextStageRunning}
                            <span class="animate-pulse text-sm text-primary/70"
                              >Next stage running...</span
                            >
                          {:else}
                            <div class="flex items-center gap-3">
                              <div class="flex gap-1">
                                <div
                                  class="h-4 w-0.5 animate-[wave_1s_ease-in-out_infinite] bg-primary"
                                ></div>
                                <div
                                  class="h-4 w-0.5 animate-[wave_1s_ease-in-out_infinite_0.2s] bg-primary"
                                ></div>
                                <div
                                  class="h-4 w-0.5 animate-[wave_1s_ease-in-out_infinite_0.4s] bg-primary"
                                ></div>
                              </div>
                              <span class="text-sm text-primary/70">Listening</span>
                            </div>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div class="absolute right-[0.5em] top-[0.5rem] h-20 w-20 opacity-20">
                    <div
                      class="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-4 border-primary"
                    ></div>
                    <div
                      class="absolute inset-2 animate-[spin_2s_linear_infinite] rounded-full border-4 border-primary"
                    ></div>
                    <div
                      class="absolute inset-4 animate-[spin_4s_linear_infinite] rounded-full border-4 border-primary"
                    ></div>
                  </div>
                </Card.Content>
              </Card.Root>

              {#if conversationResult}
                <Card.Root
                  class="relative overflow-hidden border border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4"
                >
                  <div
                    class="absolute inset-0 rounded-lg bg-gradient-to-tr from-primary/10 via-transparent to-primary/10"
                  ></div>
                  <Card.Header class="relative z-10">
                    <Card.Title
                      class="mb-2 text-sm font-medium uppercase tracking-wide text-primary/90"
                    >
                      Response
                    </Card.Title>
                    <Card.Description>
                      <div
                        class="relative text-base font-light leading-relaxed text-white/90 transition-opacity md:text-lg"
                      >
                        <div class="flex flex-col gap-2">
                          <span
                            class="text-primary animate-in fade-in slide-in-from-bottom-2 dark:text-white"
                          >
                            {conversationResult}
                          </span>
                        </div>
                      </div>
                    </Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div class="absolute right-[0.5em] top-[0.5rem] h-20 w-20 opacity-20">
                      <div
                        class="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-4 border-primary"
                      ></div>
                      <div
                        class="absolute inset-2 animate-[spin_2s_linear_infinite] rounded-full border-4 border-primary"
                      ></div>
                      <div
                        class="absolute inset-4 animate-[spin_4s_linear_infinite] rounded-full border-4 border-primary"
                      ></div>
                    </div>
                  </Card.Content>
                </Card.Root>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
