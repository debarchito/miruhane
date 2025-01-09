<script lang="ts">
  import { X, Pause, MessageSquarePlus } from "lucide-svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import AppSidebar from "$lib/components/custom/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

  let { data } = $props();
  let isStarted = $state(false);
  let transcription = $state("");
  let isLoading = $state(false);
  let mediaRecorder: MediaRecorder;
  // eslint-disable-next-line
  let audioChunks: BlobPart[] = [];

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.start(100); // Record in 100ms chunks
      isStarted = true;
    } catch (err) {
      console.error(err);
    }
  }

  function resetState() {
    isStarted = false;
    transcription = "";
    isLoading = false;
    audioChunks = [];
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }

  async function stopRecording(shouldProcess = true) {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();

      await new Promise((resolve) => {
        mediaRecorder.addEventListener("stop", resolve, { once: true });
      });

      mediaRecorder.stream.getTracks().forEach((track) => track.stop());

      if (shouldProcess) {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        isLoading = true;
        try {
          const res = await fetch("/api/infer", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          console.log(data);
          transcription = data.text;
        } catch (err) {
          console.error("Error sending audio:", err);
        } finally {
          isLoading = false;
        }
      } else {
        resetState();
      }

      audioChunks = [];
    }
  }
</script>

<svelte:head>
  <title>Chat | miruhane.</title>
</svelte:head>

<Sidebar.Provider>
  <AppSidebar username={data.user.username} email={data.user.email} />
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2">
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
              <Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
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
            ? 'grid grid-cols-1 md:grid-cols-2'
            : ''} w-full transition-all duration-500"
        >
          <div class="flex flex-col items-center p-4">
            <div class="relative h-24 w-24 md:h-32 md:w-32">
              <div
                class:animate-[pulse_1.2s_ease-in-out_infinite]={isStarted}
                class="absolute inset-0 rounded-full border-4 border-primary/80 shadow-xl shadow-primary/30 backdrop-blur-sm"
                style="animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);"
              ></div>
              <div
                class:animate-[spin_2s_linear_infinite]={isStarted}
                class="animate-reverse absolute inset-2 rounded-full border-4 border-primary/60 shadow-xl shadow-primary/30 backdrop-blur-sm"
                style="animation-direction: reverse;"
              >
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent"
                ></div>
              </div>
              <div
                class:animate-[spin_4s_linear_infinite]={isStarted}
                class="absolute inset-4 rounded-full border-4 border-primary/40 shadow-xl shadow-primary/30 backdrop-blur-sm"
              >
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-bl from-primary/20 to-transparent"
                ></div>
              </div>
              <div
                class:animate-[pulse_2s_ease-in-out_infinite]={isStarted}
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
            </div>

            {#if isStarted}
              <div class="mt-8 flex flex-col gap-4 px-4 sm:mt-12 sm:scale-110 sm:flex-row sm:gap-6">
                <button
                  onclick={resetState}
                  class="group relative flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-destructive via-destructive/90 to-destructive/80 px-6 py-3 text-white shadow-xl shadow-destructive/20 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-destructive/40 sm:w-auto sm:px-8"
                >
                  <span
                    class="absolute inset-0 rounded-full bg-gradient-to-r from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  ></span>
                  <X
                    class="h-5 w-5 transition-transform group-hover:rotate-90 group-hover:scale-110"
                  />
                  <span class="font-medium tracking-wide">Cancel</span>
                </button>
                <button
                  onclick={() => stopRecording(true)}
                  disabled={isLoading}
                  class="group relative flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-6 py-3 text-white shadow-xl shadow-primary/20 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-primary/20 sm:w-auto sm:px-8"
                >
                  <span
                    class="absolute inset-0 rounded-full bg-gradient-to-r from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  ></span>
                  {#if isLoading}
                    <div
                      class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    ></div>
                  {:else}
                    <Pause class="h-5 w-5 transition-transform group-hover:scale-125" />
                  {/if}

                  <span class="font-medium tracking-wide">Done</span>
                </button>
              </div>
            {:else}
              <button
                onclick={startRecording}
                class="group relative mt-8 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-6 py-3 text-white shadow-xl shadow-primary/30 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:scale-105 hover:shadow-primary/50 sm:mt-12 sm:w-auto sm:px-8"
              >
                <span
                  class="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 transition-opacity group-hover:opacity-100"
                ></span>
                <MessageSquarePlus
                  class="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110"
                />
                <span class="font-medium tracking-wide">Start Conversation</span>
              </button>
            {/if}
          </div>

          {#if isStarted}
            <div
              class="p-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 md:p-8"
            >
              <div
                class="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 p-4 shadow-xl shadow-primary/10 backdrop-blur-md md:p-6"
              >
                <div
                  class="absolute inset-0 rounded-lg bg-gradient-to-tr from-primary/10 via-transparent to-primary/10"
                ></div>

                <div class="relative z-10">
                  <span
                    class="mb-2 inline-block text-sm font-medium uppercase tracking-wide text-primary/90"
                    >Transcription</span
                  >

                  {#if isLoading}
                    <div class="flex items-center gap-3">
                      <div
                        class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                      ></div>
                      <p
                        class="relative animate-pulse text-base font-light leading-relaxed text-white/90 transition-opacity md:text-lg"
                      >
                        Processing your audio...
                      </p>
                    </div>
                  {:else}
                    <p
                      class="relative text-base font-light leading-relaxed text-white/90 transition-opacity md:text-lg"
                    >
                      {#if transcription}
                        <span class="animate-in fade-in slide-in-from-bottom-2"
                          >{transcription}</span
                        >
                      {:else}
                        <span class="flex items-center gap-2">
                          Listening
                          <span class="inline-flex">
                            <span class="animate-bounce delay-100">.</span>
                            <span class="animate-bounce delay-200">.</span>
                            <span class="animate-bounce delay-300">.</span>
                          </span>
                        </span>
                      {/if}
                    </p>
                  {/if}
                </div>

                <div class="absolute right-0 top-0 h-20 w-20 opacity-20">
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

                <div
                  class="absolute bottom-2 right-2 h-2 w-2 animate-ping rounded-full bg-primary"
                ></div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
