<script lang="ts">
  import { enhance } from "$app/forms";
  import { type ActionData } from "./$types";
  import * as Card from "$lib/components/ui/card/index.js";
  import Google from "$lib/components/icons/Google.svelte";
  import GitHub from "$lib/components/icons/GitHub.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { LogIn, TriangleAlert, Eye, EyeClosed } from "lucide-svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";

  let { form }: { form: ActionData } = $props();
  let showPassword = $state(false);
</script>

<svelte:head>
  <title>Sign In | miruhane.</title>
</svelte:head>

<Card.Root
  class="mx-auto max-w-sm border border-primary/30 bg-primary/5 bg-opacity-20 shadow-lg backdrop-blur-lg"
>
  <Card.Header>
    <Card.Title class="text-2xl">Sign In</Card.Title>
    <Card.Description>Enter your email to sign in to your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <form class="grid gap-4" method="POST" action="?/sign-in" use:enhance>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="contact@janedoe.com" required />
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
              name="password"
              placeholder="~!@#$%^"
              required
            />
            <button
              type="button"
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
      {#if form?.message}
        <Alert.Root class="border-red-600 dark:border-red-400">
          <Alert.Description class="font-medium text-red-600 dark:text-red-400">
            <TriangleAlert class="mr-2 inline-block h-5 w-5" />
            {form?.message}
          </Alert.Description>
        </Alert.Root>
      {/if}
      <Separator class="mx-auto max-w-10" />
      <div class="grid grid-cols-2 gap-4">
        <AlertDialog.Root>
          <AlertDialog.Trigger class="w-full {buttonVariants({ variant: 'outline' })}">
            <GitHub />
          </AlertDialog.Trigger>
          <AlertDialog.Content class="w-4/5">
            <AlertDialog.Header>
              <AlertDialog.Title>WIP!</AlertDialog.Title>
              <AlertDialog.Description>
                Social sign-in is yet to be implemented! This button is a placeholder for now.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Got it!</AlertDialog.Cancel>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
        <AlertDialog.Root>
          <AlertDialog.Trigger class="w-full {buttonVariants({ variant: 'outline' })}">
            <Google />
          </AlertDialog.Trigger>
          <AlertDialog.Content class="w-4/5">
            <AlertDialog.Header>
              <AlertDialog.Title>WIP!</AlertDialog.Title>
              <AlertDialog.Description>
                Social sign-in is yet to be implemented! This button is a placeholder for now.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Got it!</AlertDialog.Cancel>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </div>
    </div>
    <div class="mt-4 text-center text-sm">
      Don't have an account?
      <a href="/sign-up" class="underline">Sign Up</a>
    </div>
  </Card.Content>
</Card.Root>
