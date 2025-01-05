<script lang="ts">
  import { ShieldCheck } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Google from "$lib/components/icons/Google.svelte";
  import GitHub from "$lib/components/icons/GitHub.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let email = "";
  let password = "";
  let confirmPassword = "";

  let errors: Record<string, string> = {};

  function validateForm() {
    errors = {};

    // Email validation
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (validateForm()) {
      // Dispatch event or call server-side logic
      dispatch("submit", { email, password });
    }
  }
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign Up</Card.Title>
    <Card.Description>Enter your email to sign up for an account</Card.Description>
  </Card.Header>
  <Card.Content>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="grid gap-4">
        <!-- Email Field -->
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="abc@example.com"
            bind:value={email}
            class={errors.email ? "border-red-500" : ""}
            required
          />

          {#if errors.email}
            <p class="text-sm text-red-500">{errors.email}</p>
          {/if}
        </div>

        <!-- Password Field -->
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="~!@#$%^&"
            bind:value={password}
            class={errors.password ? "border-red-500" : ""}
            required
          />
          {#if errors.password}
            <p class="text-sm text-red-500">{errors.password}</p>
          {/if}
        </div>

        <!-- Confirm Password Field -->
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="confirm-password">Confirm Password</Label>
          </div>
          <Input
            id="confirm-password"
            type="password"
            placeholder="~!@#$%^&"
            bind:value={confirmPassword}
            class={errors.confirmPassword ? "border-red-500" : ""}
            required
          />
          {#if errors.confirmPassword}
            <p class="text-sm text-red-500">{errors.confirmPassword}</p>
          {/if}
        </div>

        <!-- Submit Button -->
        <Button type="submit" class="w-full">
          <ShieldCheck />
          Verify
        </Button>
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
    </form>
    <div class="mt-4 text-center text-sm">
      Already have an account?
      <a href="/sign-in" class="underline">Sign In</a>
    </div>
  </Card.Content>
</Card.Root>
