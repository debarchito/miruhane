<script lang="ts">
  import {
    Menu,
    X,
    Brain,
    Play,
    Cpu,
    Mic,
    Globe,
    Clock,
    Search,
    Shield,
    Cloud,
  } from "lucide-svelte";

  let isIntersecting = $state(false);
  let isMenuOpen = $state(false);

  $effect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isIntersecting = true;
        }
      });
    });

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<main class="min-h-screen bg-black text-white">
  <nav class="container mx-auto px-4 py-6">
    <div class="flex items-center justify-between">
      <div class="text-2xl font-bold">miruhane</div>
      <button class="block sm:hidden" onclick={toggleMenu} aria-label="Menu">
        {#if isMenuOpen}
          <X class="h-6 w-6" />
        {:else}
          <Menu class="h-6 w-6" />
        {/if}
      </button>
      <div class="hidden sm:flex sm:items-center sm:space-x-8">
        <a href="#features" class="transition hover:text-gray-400">Features</a>
        <a href="#pricing" class="transition hover:text-gray-400">Pricing</a>
        <a
          href="/sign-up"
          class="rounded-lg bg-white px-6 py-2 text-black transition hover:bg-gray-200"
        >
          Get Started
        </a>
      </div>
    </div>
    {#if isMenuOpen}
      <div class="mt-4 flex flex-col space-y-4 sm:hidden">
        <a href="#features" class="transition hover:text-gray-400">Features</a>
        <a href="#pricing" class="transition hover:text-gray-400">Pricing</a>
        <a
          href="/sign-up"
          class="rounded-lg bg-white px-6 py-2 text-black transition hover:bg-gray-200"
        >
          Get Started
        </a>
      </div>
    {/if}
  </nav>

  <header class="polka-dots container mx-auto px-4 py-20">
    <div class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div class="text-left">
        <h1
          class="animate-on-scroll mb-8 text-4xl font-bold tracking-tight sm:text-6xl"
          class:opacity-100={isIntersecting}
          class:translate-y-0={isIntersecting}
        >
          Your AI Conversation Partner
        </h1>
        <p
          class="animate-on-scroll mb-12 text-lg text-gray-400 sm:text-xl"
          class:opacity-100={isIntersecting}
          class:translate-y-0={isIntersecting}
        >
          Experience the future of communication with miruhane. Choose from leading AI models like
          Gemini, Claude and more, with local WebGPU acceleration for unmatched speed. Multiple
          STT/TTS options, automatic transcription, and GDPR-compliant privacy - all the AI
          assistant features you need.
        </p>
        <div
          class="animate-on-scroll flex flex-col gap-4 sm:flex-row sm:gap-6"
          class:opacity-100={isIntersecting}
          class:translate-y-0={isIntersecting}
        >
          <a
            href="/sign-up"
            class="flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-lg text-black transition hover:bg-gray-200"
            ><Play class="h-5 w-5" /> Try For Free</a
          >
          <button
            class="flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-8 py-3 text-lg transition hover:bg-white/5"
          >
            <Mic class="h-5 w-5" />
            Watch Demo</button
          >
        </div>
      </div>
      <div
        class="animate-on-scroll mx-auto w-full max-w-lg md:mx-0"
        class:opacity-100={isIntersecting}
        class:translate-y-0={isIntersecting}
      >
        <div class="relative">
          <div
            class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-75 blur-lg"
          ></div>
          <div class="relative rounded-2xl bg-gray-900 p-6 backdrop-blur-xl">
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div
                  class="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                ></div>
                <div class="flex-1 space-y-1">
                  <div class="h-4 w-24 rounded-full bg-gray-800"></div>
                  <div class="h-3 w-16 rounded-full bg-gray-800"></div>
                </div>
              </div>
              <div class="space-y-3">
                <div class="h-4 w-full rounded-full bg-gray-800"></div>
                <div class="h-4 w-5/6 rounded-full bg-gray-800"></div>
                <div class="h-4 w-4/6 rounded-full bg-gray-800"></div>
              </div>
              <div class="flex justify-end">
                <div class="h-8 w-24 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <section class="container mx-auto px-4 py-20">
    <div class="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-4">
      <div
        class="animate-on-scroll rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm sm:p-8"
        class:opacity-100={isIntersecting}
        class:translate-y-0={isIntersecting}
      >
        <div class="mb-4"><Clock class="h-8 w-8" /></div>
        <h3 class="mb-4 text-2xl font-bold">Content Awareness</h3>
        <p class="text-gray-400">
          Advanced memory and context tracking keeps conversations coherent. Choose from models like
          Gemini, Claude, and more for the perfect balance of capabilities.
        </p>
      </div>
      <div
        class="animate-on-scroll rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm sm:p-8"
        class:opacity-100={isIntersecting}
        class:translate-y-0={isIntersecting}
      >
        <div class="mb-4"><Search class="h-8 w-8" /></div>
        <h3 class="mb-4 text-2xl font-bold">Smart Features</h3>
        <p class="text-gray-400">
          Multiple STT/TTS models and modes, automatic searchable transcription, and AI assistant
          capabilities. All powered by optional WebGPU acceleration.
        </p>
      </div>
      <div
        class="animate-on-scroll rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm sm:p-8"
        class:opacity-100={isIntersecting}
        class:translate-y-0={isIntersecting}
      >
        <div class="mb-4"><Shield class="h-8 w-8" /></div>
        <h3 class="mb-4 text-2xl font-bold">Privacy First</h3>
        <p class="text-gray-400">
          Fully GDPR compliant with local processing options. Your conversations stay private and
          secure while maintaining lightning-fast performance.
        </p>
      </div>
      <div
        class="animate-on-scroll rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm sm:p-8"
        class:opacity-100={isIntersecting}
        class:translate-y-0={isIntersecting}
      >
        <div class="mb-4"><Brain class="h-8 w-8" /></div>
        <h3 class="mb-4 text-2xl font-bold">AI Powered</h3>
        <p class="text-gray-400">
          Cutting-edge AI models provide intelligent responses and deep understanding. Experience
          natural conversations with state-of-the-art language processing.
        </p>
      </div>
    </div>
  </section>
</main>

<style>
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .opacity-100 {
    opacity: 1;
  }

  .translate-y-0 {
    transform: translateY(0);
  }

  .polka-dots {
    background:
      radial-gradient(
        circle at 100% 50%,
        transparent 20%,
        rgba(255, 255, 255, 0.03) 21%,
        rgba(255, 255, 255, 0.03) 34%,
        transparent 35%,
        transparent
      ),
      radial-gradient(
          circle at 0% 50%,
          transparent 20%,
          rgba(255, 255, 255, 0.03) 21%,
          rgba(255, 255, 255, 0.03) 34%,
          transparent 35%,
          transparent
        )
        0 -50px;
    background-size: 75px 100px;
    animation: polka-move 3s linear infinite;
  }

  @keyframes polka-move {
    from {
      background-position:
        0 0,
        0 -50px;
    }
    to {
      background-position:
        75px 0,
        75px -50px;
    }
  }
</style>
