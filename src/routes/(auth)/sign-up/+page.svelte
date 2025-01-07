<script lang="ts">
  import { formSchema } from "./schema.js";
  import type { PageData } from "./$types";
  import { zod } from "sveltekit-superforms/adapters";
  import * as Card from "$lib/components/ui/card/index.js";
  import Google from "$lib/components/icons/Google.svelte";
  import GitHub from "$lib/components/icons/GitHub.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { superForm } from "sveltekit-superforms/client";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { ShieldCheck, Eye, EyeClosed, TriangleAlert } from "lucide-svelte";

  let { data }: { data: PageData } = $props();
  let { form, constraints, errors, enhance, message } = superForm(data.form, {
    validators: zod(formSchema),
  });
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign Up</Card.Title>
    <Card.Description>Enter your email to sign up for an account</Card.Description>
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
          <div class="flex items-center justify-between">
            <Label for="password">Password</Label>
          </div>
          <div class="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="~!@#$%^&"
              aria-invalid={$errors.password ? "true" : undefined}
              bind:value={$form.password}
              class={$form.password !== $form.confirmPassword ? "border-red-400" : ""}
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
        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <Label for="confirm-password">Confirm password</Label>
          </div>
          <div class="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="~!@#$%^&"
              aria-invalid={$errors.confirmPassword ? "true" : undefined}
              bind:value={$form.confirmPassword}
              class={$form.password !== $form.confirmPassword ? "border-red-400" : ""}
              {...$constraints.confirmPassword}
            />
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2"
              onclick={() => (showConfirmPassword = !showConfirmPassword)}
            >
              {#if showConfirmPassword}
                <EyeClosed />
              {:else}
                <Eye />
              {/if}
            </button>
          </div>
        </div>
        <Button type="submit" class="w-full" disabled={$form.password !== $form.confirmPassword}>
          <ShieldCheck />
          Verify
        </Button>
      </form>
      {#if $message}
        <Alert.Root class="border-red-400">
          <Alert.Description class="font-medium text-red-400">
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
      Already have an account?
      <a href="/sign-in" class="underline">Sign In</a>
    </div>
  </Card.Content>
</Card.Root>
