<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import GlassButton from "$lib/components/custom/glass-button.svelte";
  import SectionHeader from "$lib/components/custom/section-header.svelte";
  import GlassCardGrid from "$lib/components/custom/glass-card-grid.svelte";
  import {
    Menu,
    X,
    Play,
    Mic,
    Clock,
    Github,
    Twitter,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    CircleHelp,
    Star,
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
  const featureEntries = [
    {
      icon: Clock,
      title: "Context Aware Conversations",
      description:
        "Advanced memory and contextual tracking keeps long conversations coherent and meaningful.",
      link: "#",
    },
    {
      icon: Mic,
      title: "Flexible Communication",
      description:
        "Seamless switching between voice and chat mode. Conversations remain coherent whether typing or speaking for a natural flow.",
      link: "#",
    },
    {
      icon: Play,
      title: "Universal Accessibility",
      description:
        "Cross-browser support with fallback options when Web Speech API is unavailable. Works reliably across all major platforms and devices.",
      link: "#",
    },
    {
      icon: Mail,
      title: "Comprehensive History",
      description:
        "Full conversation history tracking with powerful search capabilities. Easily find and reference past interactions using full-text search.",
      link: "#",
    },
    {
      icon: Play,
      title: "Multiple AI Models",
      description:
        "Support for models like Gemini 1.5 Flash, with upcoming integration of o1 and Claude. Choose the best AI for your specific needs.",
      link: "#",
    },
    {
      icon: Mail,
      title: "Assistant Features",
      description:
        "Powerful tools including Q&A preparation, summarization, and research assistance. Continuously expanding feature set for enhanced productivity.",
      link: "#",
    },
  ];

  const footerEntries = {
    company: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
    contact: {
      email: "miruhane@aurialis.com",
      phone: "+91 9876-543-210",
      address: "123 Auto Ave, Sci-Fi City, SC 12345",
    },
    social: [
      { icon: Github, href: "https://github.com/debarchito/miruhane" },
      { icon: Twitter, href: "#" },
      { icon: Linkedin, href: "#" },
    ],
  };
</script>

<svelte:head>
  <title>miruhane.</title>
</svelte:head>

<main class="min-h-screen">
  <nav class="container mx-auto px-4 py-6">
    <div class="flex items-center justify-between rounded-2xl bg-white/5 p-4 backdrop-blur-lg">
      <div
        class="bg-gradient-to-r from-foreground to-primary bg-clip-text text-2xl font-bold text-transparent"
      >
        miruhane.
      </div>
      <button
        class="block rounded-lg bg-white/10 p-2 backdrop-blur-sm transition hover:bg-white/20 sm:hidden"
        onclick={toggleMenu}
        aria-label="Menu"
      >
        {#if isMenuOpen}
          <X class="h-6 w-6" />
        {:else}
          <Menu class="h-6 w-6" />
        {/if}
      </button>
      <div class="hidden sm:flex sm:items-center sm:space-x-8">
        <a
          href="#features"
          class="flex transform-gpu items-center gap-1 font-semibold tracking-wide underline transition hover:scale-105 hover:text-primary"
        >
          <Star class="h-4 w-4" />
          What we got?
        </a>
        <GlassButton type="link" href="/sign-in">
          {#snippet children()}
            <span
              class="bg-gradient-to-r from-foreground to-primary bg-clip-text font-bold tracking-wider text-transparent"
              >Sign In!</span
            >
            <ArrowRight
              class="h-4 w-4 transition-transform group-hover:translate-x-2 group-hover:rotate-12"
            />
          {/snippet}
        </GlassButton>
      </div>
    </div>
    {#if isMenuOpen}
      <div
        class="mt-4 flex flex-col space-y-4 rounded-xl bg-white/5 p-4 backdrop-blur-lg sm:hidden"
      >
        <a
          href="#features"
          class="flex transform-gpu items-center justify-center gap-1 font-semibold tracking-wide underline transition hover:scale-105 hover:text-primary hover:underline"
        >
          <Star class="h-4 w-4" />
          What we got?
        </a>
        <GlassButton type="link" href="/sign-in">
          {#snippet children()}
            <span
              class="bg-gradient-to-r from-foreground to-primary bg-clip-text font-bold tracking-wider text-transparent"
              >Sign In!</span
            >
            <ArrowRight
              class="h-4 w-4 transition-transform group-hover:translate-x-2 group-hover:rotate-12"
            />
          {/snippet}
        </GlassButton>
      </div>
    {/if}
  </nav>

  <header class="polka-dots container mx-auto px-4 py-12 sm:py-20">
    <div class="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
      <div class="relative rounded-2xl bg-white/5 p-8 text-center backdrop-blur-lg md:text-left">
        <div
          class="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-white/20 opacity-50"
        ></div>
        <div class="relative">
          <h1
            class="animate-on-scroll animate-gradient mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl"
            class:opacity-100={isIntersecting}
            class:translate-y-0={isIntersecting}
          >
            Your Conversation Partner
          </h1>
          <p
            class="animate-on-scroll mb-8 text-base text-foreground sm:mb-12 sm:text-lg md:text-2xl"
            class:opacity-100={isIntersecting}
            class:translate-y-0={isIntersecting}
          >
            Advanced. Intelligent. Private. Secure. The complete AI assistant you need.
          </p>
          <div
            class="animate-on-scroll flex flex-col justify-center gap-4 sm:flex-row sm:gap-6 md:justify-start"
            class:opacity-100={isIntersecting}
            class:translate-y-0={isIntersecting}
          >
            <GlassButton type="link" href="/sign-in">
              {#snippet children()}
                <span
                  class="bg-gradient-to-r from-foreground to-primary bg-clip-text font-bold tracking-wider text-transparent"
                  >Try Now!</span
                >
                <ArrowRight
                  class="h-4 w-4 transition-transform group-hover:translate-x-2 group-hover:rotate-12"
                />
              {/snippet}
            </GlassButton>
          </div>
        </div>
      </div>
      <div
        class="animate-on-scroll relative mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg"
        class:opacity-100={isIntersecting}
        class:translate-y-0={isIntersecting}
      >
        <div class="animate-float-slow absolute right-[-10px] top-[-20px]">
          <div class="h-12 w-12 rotate-12 rounded-lg bg-primary/30 backdrop-blur-sm"></div>
        </div>
        <div class="animate-float-delayed absolute bottom-[-30px] left-[-20px]">
          <div class="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm"></div>
        </div>
        <div class="relative">
          <div
            class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-white/50 opacity-75 blur-lg"
          ></div>
          <div class="relative rounded-2xl bg-white/5 p-4 backdrop-blur-xl sm:p-6">
            <div class="space-y-4 sm:space-y-6">
              <div class="flex items-center gap-4">
                <div
                  class="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-primary to-white/90 sm:h-10 sm:w-10"
                ></div>
                <div class="flex-1 space-y-1">
                  <div class="h-3 w-20 rounded-full bg-white/10 sm:h-4 sm:w-24"></div>
                  <div class="h-2 w-14 rounded-full bg-white/10 sm:h-3 sm:w-16"></div>
                </div>
              </div>
              <div class="space-y-2 sm:space-y-3">
                <div class="h-3 w-full rounded-full bg-white/10 sm:h-4"></div>
                <div class="h-3 w-5/6 rounded-full bg-white/10 sm:h-4"></div>
                <div class="h-3 w-4/6 rounded-full bg-white/10 sm:h-4"></div>
              </div>
              <div class="flex justify-end">
                <div
                  class="h-6 w-20 rounded-lg bg-gradient-to-r from-primary to-white/90 transition-transform hover:scale-105 sm:h-8 sm:w-24"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="animate-float absolute right-[-40px] top-[50%]">
          <div class="h-10 w-10 rotate-45 rounded-lg bg-primary/40 backdrop-blur-sm"></div>
        </div>
      </div>
    </div>
  </header>

  <section class="container mx-auto px-4 py-16 sm:py-20">
    <div id="features" class="mt-10 flex justify-center">
      <SectionHeader title="What we got?" Icon={Star} description="...a lot actually!" />
    </div>
    <GlassCardGrid entries={featureEntries} />
    <div class="mt-3 flex justify-center">
      <GlassButton type="link">
        {#snippet children()}
          <span>...and more!</span>
          <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
        {/snippet}
      </GlassButton>
    </div>
    <div class="mt-20 flex justify-center">
      <SectionHeader title="Not Convinced?" Icon={CircleHelp} />
    </div>
    <div class="mt-5 flex justify-center">
      <div
        class="sparkle-stars rounded-xl bg-gradient-to-r from-white/30 to-primary/30 shadow-primary backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:from-white/50 hover:to-primary/50 hover:shadow-[0_0_40px_rgba(200,0,0,0.5)]"
      >
        <GlassButton type="link" href="/sign-in">
          {#snippet children()}
            <span
              class="bg-gradient-to-r from-foreground to-primary bg-clip-text font-bold tracking-wider text-transparent"
              >Try Now!</span
            >
            <ArrowRight
              class="h-4 w-4 transition-transform group-hover:translate-x-2 group-hover:rotate-12"
            />
          {/snippet}
        </GlassButton>
      </div>
    </div>
  </section>

  <footer class="relative w-full bg-background/80 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div class="space-y-4 text-center sm:text-left">
          <h4 class="text-lg font-semibold">Aurialis</h4>
          <ul class="space-y-2">
            {#each footerEntries.company as entry}
              <li>
                <a
                  href={entry.href}
                  class="text-sm text-muted-foreground/70 transition-colors hover:text-primary"
                >
                  {entry.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="space-y-4 text-center sm:text-left">
          <h4 class="text-lg font-semibold">Resources</h4>
          <ul class="space-y-2">
            {#each footerEntries.resources as link}
              <li>
                <a
                  href={link.href}
                  class="text-sm text-muted-foreground/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="space-y-4 text-center sm:text-left">
          <h4 class="text-lg font-semibold">Contact</h4>
          <ul class="space-y-2">
            <li
              class="flex items-center justify-center gap-2 text-sm text-muted-foreground/70 sm:justify-start"
            >
              <Mail class="h-4 w-4" />
              {footerEntries.contact.email}
            </li>
            <li
              class="flex items-center justify-center gap-2 text-sm text-muted-foreground/70 sm:justify-start"
            >
              <Phone class="h-4 w-4" />
              {footerEntries.contact.phone}
            </li>
            <li
              class="flex items-center justify-center gap-2 text-sm text-muted-foreground/70 sm:justify-start"
            >
              <MapPin class="h-4 w-4" />
              {footerEntries.contact.address}
            </li>
          </ul>
        </div>

        <div class="space-y-4 text-center sm:text-left">
          <h4 class="text-lg font-semibold">Follow Us</h4>
          <div class="flex justify-center gap-4 sm:justify-start">
            {#each footerEntries.social as link}
              <a
                href={link.href}
                class="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
                target="_blank"
                rel="noopener noreferrer"
              >
                <link.icon class="h-5 w-5" />
              </a>
            {/each}
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-border/30 pt-6 sm:mt-12 sm:pt-8">
        <div class="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
          <p class="text-sm text-muted-foreground/70">
            miruhane © {new Date().getFullYear()} <b>Aurialis</b>. All rights reserved.
          </p>
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="text-xs">PDP</Badge>
            <Badge variant="outline" class="text-xs">CCPA</Badge>
            <Badge variant="outline" class="text-xs">GDPR</Badge>
          </div>
        </div>
      </div>
    </div>
  </footer>
</main>

<style lang="postcss">
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

  .sparkle-stars {
    position: relative;
  }

  .sparkle-stars::before,
  .sparkle-stars::after {
    content: "★";
    position: absolute;
    @apply text-foreground;
    font-size: 12px;
    animation: twinkle 2s ease-in-out infinite;
  }

  .sparkle-stars::before {
    top: -15px;
    left: 30%;
  }

  .sparkle-stars::after {
    bottom: -15px;
    right: 30%;
    animation-delay: 1s;
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.2;
      transform: scale(0.5) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.2) rotate(180deg);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  @keyframes float-delayed {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-15px);
    }
  }
  @keyframes float-slow {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-float-delayed {
    animation: float-delayed 4s ease-in-out infinite;
  }
  .animate-float-slow {
    animation: float-slow 5s ease-in-out infinite;
  }
</style>
