<script lang="ts">
  import { LogIn } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Google from "$lib/components/icons/Google.svelte";
  import GitHub from "$lib/components/icons/GitHub.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign In</Card.Title>
    <Card.Description>Enter your email to sign in to your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="abc@example.com" required />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password">Password</Label>
          <a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
        </div>
        <Input id="password" type="password" placeholder="~!@#$%^&" required />
      </div>
      <Button type="submit" class="w-full">
        <LogIn />
        Sign In
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
    <div class="mt-4 text-center text-sm">
      Don't have an account?
      <a href="/sign-up" class="underline">Sign Up</a>
    </div>
  </Card.Content>
</Card.Root>
