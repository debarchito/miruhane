<script lang="ts">
  import { toast } from "svelte-sonner";
  import { toggleMode, mode } from "mode-watcher";
  import { settings, history } from "$lib/runes.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import AppSidebar from "$lib/components/custom/app-sidebar.svelte";
  import InstantHistory from "$lib/components/custom/instant-history.svelte";
  import QnaComponent from "$lib/components/custom/qna.svelte";
  import {
    X,
    Play,
    Pause,
    Check,
    MessageSquare,
    Mic,
    Sun,
    Moon,
    MessageSquareWarning,
  } from "lucide-svelte";

  let { data } = $props();
  history.set(data.history);
  settings.set(data.settings);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recognition: any = $state(null);
  let synthesis: SpeechSynthesis | null = $state(null);
  let currentHistoryId: string | null = $state(null);
  let isFirstMessage = $state(true);
  let isSpeaking = $state(false);

  // Initialize Web Speech API if available
  $effect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        // eslint-disable-next-line
        // @ts-ignore
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        let lastResult = "";
        // eslint-disable-next-line
        recognitionInstance.onresult = (event: any) => {
          const results = Array.from(event.results);
          // eslint-disable-next-line
          const transcript = results.map((result: any) => result[0].transcript).join("");
          if (transcript !== lastResult) {
            transcription = transcript;
            lastResult = transcript;
          }
        };
        recognition = recognitionInstance;
      }

      synthesis = window.speechSynthesis;
      if (synthesis) {
        synthesis.onvoiceschanged = () => {
          synthesis!.getVoices();
        };
      }
    }
  });

  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Array<Blob> = [];
  let hasStarted = $state(false);
  let isPaused = $state(false);
  let isLoading = $state(false);
  let toRunNextStage = $state(false);
  let transcription = $state("");
  let conversationResult = $state("");
  let transcriptionHistory = $state<{ text: string; timestamp: Date; author: string }[]>([]);
  let currentAudio: HTMLAudioElement | null = null;
  let audioCurrentTime: number = 0;
  let isAudioPaused = $state(false);
  let messageText = $state("");
  let isVoiceMode = $state(true);
  let showWarning = $state(true);

  async function initMediaRecorder() {
    if (settings.getKeyValue("model-stt") === "browser") {
      return null;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });
    recorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    return recorder;
  }

  async function toggleInputMode() {
    const cleanupCurrentMode = async () => {
      if (isVoiceMode) {
        if (settings.getKeyValue("model-stt") === "browser" && recognition) {
          recognition.stop();
        } else if (mediaRecorder?.state !== "inactive") {
          mediaRecorder!.requestData();
          mediaRecorder!.stop();
          mediaRecorder!.stream.getTracks().forEach((track) => track.stop());
        }
        mediaRecorder = null;
        audioChunks = [];
      }
    };

    await cleanupCurrentMode();
    isVoiceMode = !isVoiceMode;

    if (isVoiceMode) {
      await startRecording();
    }
  }

  async function startConversation() {
    hasStarted = true;
    isFirstMessage = true;
    void startRecording();
  }

  async function startRecording() {
    try {
      if (isSpeaking) return;

      if (settings.getKeyValue("model-stt") === "browser") {
        if (recognition) {
          try {
            const state = recognition.state || recognition.recognitionState;
            if (state !== "running") {
              recognition.start();
            }
          } catch (e) {
            // eslint-disable-next-line
            // @ts-ignore
            if (!e.message.includes("already started")) {
              throw e;
            }
          }
        }
      } else {
        mediaRecorder = await initMediaRecorder();
        if (mediaRecorder) {
          audioChunks = [];
          mediaRecorder.start(100);
        }
      }
      hasStarted = true;
      isPaused = false;
      isAudioPaused = false;
      toRunNextStage = false;
    } catch (err) {
      console.error(err);
      toast("Failed to start recording", {
        // eslint-disable-next-line
        // @ts-ignore
        description: err.message,
        icon: MessageSquareWarning,
      });
    }
  }

  function resetState() {
    const resetStateValues = () => {
      hasStarted = false;
      isPaused = false;
      isAudioPaused = false;
      transcription = "";
      transcriptionHistory = [];
      conversationResult = "";
      isLoading = false;
      toRunNextStage = false;
      audioChunks = [];
      audioCurrentTime = 0;
      messageText = "";
      isFirstMessage = true;
      currentHistoryId = null;
      isSpeaking = false;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      if (synthesis && synthesis.speaking) {
        synthesis.cancel();
      }
    };

    const stopMediaRecorder = () => {
      if (settings.getKeyValue("model-stt") === "browser" && recognition) {
        recognition.stop();
      } else if (mediaRecorder?.state !== "inactive") {
        mediaRecorder!.stop();
        mediaRecorder!.stream.getTracks().forEach((track) => track.stop());
      }
    };

    resetStateValues();
    stopMediaRecorder();
  }

  function pauseRecording() {
    if (currentAudio) {
      isAudioPaused = !isAudioPaused;
      if (isAudioPaused) {
        isPaused = true;
        audioCurrentTime = currentAudio.currentTime;
        currentAudio.pause();
      } else {
        isPaused = false;
        currentAudio.currentTime = audioCurrentTime;
        currentAudio.play();
      }
      return;
    }

    if (settings.getKeyValue("model-stt") === "browser" && recognition) {
      if (!isPaused) {
        recognition.stop();
      } else {
        try {
          recognition.start();
        } catch (e) {
          // eslint-disable-next-line
          // @ts-ignore
          if (!e.message.includes("already started")) {
            throw e;
          }
        }
      }
      isPaused = !isPaused;
      return;
    }

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

  async function processInput(input: string | Blob) {
    const createFormData = (data: Record<string, string | Blob>) => {
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        fd.append(key, value);
      });
      return fd;
    };

    let inferText: string;

    if (input instanceof Blob && settings.getKeyValue("model-stt") !== "browser") {
      const inferRes = await fetch("/api/infer", {
        method: "POST",
        body: createFormData({
          audio: input,
        }),
      })
        .then((r) => r.json())
        .catch((err) => {
          console.error(err);
          toast("Failed processing audio", {
            // eslint-disable-next-line
            // @ts-ignore
            description: err.message,
            icon: MessageSquareWarning,
          });
        });
      inferText = inferRes.text;
    } else {
      inferText = input instanceof Blob ? transcription : input;
    }

    transcription = inferText;

    if (isFirstMessage) {
      await fetch("/api/history/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: inferText,
        }),
      })
        .then(async (historyRes) => {
          if (historyRes.status === 200) {
            const json = await historyRes.json();
            currentHistoryId = json.res.id;
            history.add(json);
            isFirstMessage = false;
          }
        })
        .catch((err) => {
          console.error(err);
          toast("Failed to create a history", {
            // eslint-disable-next-line
            // @ts-ignore
            description: err.message,
            icon: MessageSquareWarning,
          });
        });
    }

    transcriptionHistory = [
      ...transcriptionHistory,
      {
        text: inferText,
        timestamp: new Date(),
        author: "user",
      },
    ];

    if (currentHistoryId) {
      await fetch("/api/history/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          historyId: currentHistoryId,
          content: inferText,
          role: "user",
          createdAt: new Date(),
        }),
      }).catch((err) => {
        console.error(err);
        toast("Failed to add to history", {
          // eslint-disable-next-line
          // @ts-ignore
          description: err.message,
          icon: MessageSquareWarning,
        });
      });
    }

    const genRes = await fetch("/api/gen", {
      method: "POST",
      body: createFormData({
        context: inferText,
        historyId: currentHistoryId!,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        toast("Failed to retrieve response", {
          // eslint-disable-next-line
          // @ts-ignore
          description: err.message,
          icon: MessageSquareWarning,
        });
      });

    conversationResult = genRes.text;

    if (currentHistoryId) {
      await fetch("/api/history/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          historyId: currentHistoryId,
          content: genRes.text,
          role: "miruhane",
          createdAt: new Date(),
        }),
      }).catch((err) => {
        console.error(err);
        toast("Failed to add to history", {
          // eslint-disable-next-line
          // @ts-ignore
          description: err.message,
          icon: MessageSquareWarning,
        });
      });
    }

    transcriptionHistory = [
      ...transcriptionHistory,
      {
        text: genRes.text,
        timestamp: new Date(),
        author: "miruhane",
      },
    ];

    if (settings.getKeyValue("model-tts") === "browser" && synthesis) {
      isSpeaking = true;
      const utterance = new SpeechSynthesisUtterance(genRes.text);
      utterance.onend = () => {
        isSpeaking = false;
        if (isVoiceMode) {
          if (settings.getKeyValue("model-stt") === "browser" && recognition) {
            try {
              recognition.start();
            } catch (e) {
              // eslint-disable-next-line
              // @ts-ignore
              if (!e.message.includes("already started")) {
                throw e;
              }
            }
            isPaused = false;
          } else if (mediaRecorder && mediaRecorder.state === "paused") {
            mediaRecorder.resume();
            isPaused = false;
          }
        }
      };
      synthesis.speak(utterance);
    } else {
      const speakRes = await fetch("/api/speak", {
        method: "POST",
        body: createFormData({
          text: genRes.text,
        }),
      })
        .then((r) => r.json())
        .catch((err) => {
          console.error(err);
          toast("Failed to retrieve voice response", {
            // eslint-disable-next-line
            // @ts-ignore
            description: err.message,
            icon: MessageSquareWarning,
          });
        });

      const blob = new Blob(
        [Uint8Array.from(atob(speakRes.res.audio_data), (c) => c.charCodeAt(0))],
        {
          type: "audio/aac",
        },
      );
      const audio = new Audio(URL.createObjectURL(blob));
      audio.crossOrigin = "anonymous";
      currentAudio = audio;
      isAudioPaused = false;
      isPaused = false;
      if (isVoiceMode) {
        if (settings.getKeyValue("model-stt") === "browser" && recognition) {
          recognition.stop();
        } else if (mediaRecorder && mediaRecorder.state === "recording") {
          mediaRecorder.pause();
        }
      }
      await new Promise<void>((resolve) => {
        void audio.play().catch((err) => {
          console.error(err);
          toast("Failed to play audio response", {
            // eslint-disable-next-line
            // @ts-ignore
            description: err.message,
            icon: MessageSquareWarning,
          });
        });
        if (audio) {
          audio.onended = () => {
            currentAudio = null;
            audioCurrentTime = 0;
            isAudioPaused = false;
            isPaused = false;
            if (isVoiceMode) {
              if (settings.getKeyValue("model-stt") === "browser" && recognition) {
                try {
                  recognition.start();
                } catch (e) {
                  // eslint-disable-next-line
                  // @ts-ignore
                  if (!e.message.includes("already started")) {
                    throw e;
                  }
                }
              } else if (mediaRecorder && mediaRecorder.state === "paused") {
                mediaRecorder.resume();
              }
            }
            resolve();
          };
        }
      });
    }
  }

  async function handleInput() {
    isLoading = true;
    try {
      if (isVoiceMode) {
        if (settings.getKeyValue("model-stt") === "browser") {
          await processInput(transcription);
        } else {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          await processInput(audioBlob);
        }
      } else {
        if (!messageText.trim()) return;
        transcription = messageText;
        messageText = "";
        await processInput(transcription);
      }
      toRunNextStage = true;
    } catch (err) {
      console.error(err);
      toast("Error processing input", {
        // eslint-disable-next-line
        // @ts-ignore
        description: err.message,
        icon: MessageSquareWarning,
      });
    } finally {
      isLoading = false;
      if (isVoiceMode && !isSpeaking) {
        audioChunks = [];
        void startRecording();
      }
    }
  }

  async function stopRecording(shouldProcess = true) {
    const stopMediaRecorderAndTracks = async () => {
      if (settings.getKeyValue("model-stt") === "browser" && recognition) {
        recognition.stop();
      } else if (mediaRecorder?.state === "recording") {
        mediaRecorder.requestData();
        mediaRecorder.stop();
        await new Promise((resolve) => {
          mediaRecorder!.addEventListener("stop", resolve, { once: true });
        });
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };

    if (
      (!mediaRecorder || !["recording", "paused"].includes(mediaRecorder.state)) &&
      !recognition
    ) {
      return;
    }

    await stopMediaRecorderAndTracks();

    if (shouldProcess) {
      await handleInput();
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

<Toaster />

<Sidebar.Provider>
  <AppSidebar username={data.user.username} email={data.user.email} />
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2">
      <div class="flex w-full items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Toggle onclick={toggleMode}>
          {#if $mode === "dark"}
            <Sun class="h-5 w-5" />
          {:else}
            <Moon class="h-5 w-5" />
          {/if}
        </Toggle>
      </div>
    </header>

    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div
        class="flex min-h-[calc(100vh-6rem)] flex-1 flex-col items-center justify-center rounded-xl backdrop-blur-lg md:min-h-[calc(100vh-8rem)]"
      >
        {#if showWarning}
          <Card.Root
            class="mb-10 w-full max-w-3xl border border-primary/20 bg-primary/10 shadow-lg backdrop-blur-lg"
          >
            <Card.Header>
              <div class="flex items-center justify-between">
                <Card.Title class="text-xl font-semibold text-primary">
                  miruhane. <div
                    class="inline-flex items-center justify-center gap-1 rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-sm font-medium text-primary"
                  >
                    <span>Under Development</span>
                    🚧
                  </div>
                </Card.Title>
                <Button.Root
                  variant="ghost"
                  size="icon"
                  onclick={() => (showWarning = false)}
                  class="h-6 w-6"
                >
                  <X class="h-4 w-4" />
                </Button.Root>
              </div>
              <Card.Description class="text-muted-foreground">
                <div class="rounded-lg p-4">
                  <p class="mb-2">
                    Hi! I'm still in development, so you might see some bugs. Just refresh if
                    anything goes wrong, and don't mind my occasional slow responses (development
                    endpoints and cold starts!) 😊. It's recommended to speak in a quiet environment
                    to get the best results. Noise diffing on the way though 🎉!
                  </p>
                </div>
              </Card.Description>
              <Card.Footer></Card.Footer>
            </Card.Header>
          </Card.Root>
        {/if}

        <div
          class="{hasStarted
            ? 'grid grid-cols-1 items-center gap-4 md:grid-cols-2'
            : ''} mx-auto w-full max-w-7xl transition-all duration-500"
        >
          <div class="flex flex-col items-center justify-center p-4">
            <div class="relative h-24 w-24 md:h-32 md:w-32">
              <div
                class:animate-[pulse_1.2s_ease-in-out_infinite]={hasStarted &&
                  !isPaused &&
                  isVoiceMode}
                class="absolute inset-0 rounded-full border-4 border-primary/80 shadow-xl shadow-primary/30 backdrop-blur-sm"
                style="animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);"
              ></div>
              <div
                class:animate-[spin_2s_linear_infinite]={hasStarted && !isPaused && isVoiceMode}
                class="animate-reverse absolute inset-2 rounded-full border-4 border-primary/60 shadow-xl shadow-primary/30 backdrop-blur-sm"
                style="animation-direction: reverse;"
              >
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent"
                ></div>
              </div>
              <div
                class:animate-[spin_4s_linear_infinite]={hasStarted && !isPaused && isVoiceMode}
                class="absolute inset-4 rounded-full border-4 border-primary/40 shadow-xl shadow-primary/30 backdrop-blur-sm"
              >
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-bl from-primary/20 to-transparent"
                ></div>
              </div>
              <div
                class:animate-[pulse_2s_ease-in-out_infinite]={hasStarted &&
                  !isPaused &&
                  isVoiceMode}
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

            {#if hasStarted}
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
                  onclick={toggleInputMode}
                  class="transition-all hover:scale-105 active:scale-95"
                >
                  {#if isVoiceMode}
                    <MessageSquare class="h-4 w-4" />
                  {:else}
                    <Mic class="h-4 w-4" />
                  {/if}
                </Button.Root>

                {#if isVoiceMode}
                  <Button.Root
                    variant="outline"
                    onclick={pauseRecording}
                    class="transition-all hover:scale-105 active:scale-95"
                  >
                    {#if !isPaused && !isAudioPaused}
                      <Pause class="h-4 w-4" />
                    {:else}
                      <Play class="h-4 w-4" />
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
                {/if}

                {#if transcriptionHistory.length > 0}
                  <InstantHistory bind:transcriptionHistory bind:currentHistoryId />
                {/if}
              </div>
            {:else}
              <div class="mt-8 flex flex-row gap-4 sm:mt-12">
                <Button.Root
                  onclick={startConversation}
                  variant="outline"
                  class="relative overflow-hidden border border-primary/20 bg-primary/10 backdrop-blur-sm transition-all before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-tr before:from-primary/10 before:via-transparent before:to-primary/10 hover:scale-105 active:scale-95"
                >
                  <MessageSquare class="mr-2 h-4 w-4" />
                  Start Conversation
                </Button.Root>
              </div>
            {/if}

            {#if !isVoiceMode && hasStarted}
              <div class="mt-12 w-full max-w-xl px-4">
                <div class="relative flex items-center gap-2">
                  <Textarea
                    bind:value={messageText}
                    placeholder="Message miruhane."
                    class="rounded-lg border px-6 py-4 text-lg font-light tracking-wide transition-all"
                    onkeydown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleInput();
                      }
                    }}
                  />
                </div>
              </div>
            {/if}
          </div>

          {#if hasStarted}
            <div
              class="flex flex-col gap-4 p-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 md:p-8"
            >
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
                    Input
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
                          {#if isVoiceMode}
                            {#if (isPaused || isAudioPaused) && !isLoading}
                              <div class="flex items-center gap-3">
                                <div class="h-4 w-4 rounded-full border-2 border-primary"></div>
                                <span class="text-sm text-primary/70">Paused</span>
                              </div>
                            {:else if isLoading}
                              <div class="flex items-center gap-3">
                                <div
                                  class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                                ></div>
                                <span class="text-sm text-primary/70">Processing audio...</span>
                              </div>
                            {:else if toRunNextStage}
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
                          {:else if isLoading}
                            <div class="flex items-center gap-3">
                              <div
                                class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                              ></div>
                              <span class="text-sm text-primary/70">Processing text...</span>
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
        <QnaComponent />
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
