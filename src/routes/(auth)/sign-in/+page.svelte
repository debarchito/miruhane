<script lang="ts">
  import { type PageData } from "./$types";
  import { superForm } from "sveltekit-superforms/client";
  import * as Card from "$lib/components/ui/card/index.js";
  import Google from "$lib/components/icons/Google.svelte";
  import GitHub from "$lib/components/icons/GitHub.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { LogIn, TriangleAlert, Eye, EyeClosed } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
  let { form, constraints, errors, enhance, message } = superForm(data.form);
  let showPassword = $state(false);
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign In</Card.Title>
    <Card.Description>Enter your email to sign in to your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <form class="grid gap-4" method="POST" use:enhance>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="abc@example.com"
            aria-invalid={$errors.email ? "true" : undefined}
            bind:value={$form.email}
            {...$constraints.email}
          />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
          </div>
          <div class="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="~!@#$%^&"
              aria-invalid={$errors.password ? "true" : undefined}
              bind:value={$form.password}
              {...$constraints.password}
            />
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2"
              onclick={() => (showPassword = !showPassword)}
            >
              {#if showPassword}
                <EyeClosed />
              {:else}
                <Eye />
              {/if}
            </button>
          </div>
        </div>
        <Button type="submit" class="w-full">
          <LogIn />
          Sign In
        </Button>
      </form>
      {#if $message}
        <Alert.Root variant="destructive" class="border-red-500">
          <Alert.Description class="font-medium text-red-600">
            <TriangleAlert class="mr-2 inline-block h-5 w-5" />
            {$message}
          </Alert.Description>
        </Alert.Root>
      {/if}
      <Separator class="mx-auto max-w-10" />
      <div class="grid grid-cols-2 gap-4">
        <Button variant="outline" class="w-full">
          <Google />
        </Button>
        <Button variant="outline" class="w-full">
          <GitHub />
        </Button>
      </div>
    </div>
    <div class="mt-4 text-center text-sm">
      Don't have an account?
      <a href="/sign-up" class="underline">Sign Up</a>
    </div>
  </Card.Content>
</Card.Root>
