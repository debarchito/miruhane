<script lang="ts">
  import { ShieldCheck } from "lucide-svelte";
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
    <Card.Title class="text-2xl">Sign Up</Card.Title>
    <Card.Description>Enter your email to sign up for an account</Card.Description>
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
        </div>
        <Input id="password" type="password" placeholder="~!@#$%^&" required />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="confirm-password">Confirm password</Label>
        </div>
        <Input id="confirm-password" type="password" placeholder="~!@#$%^&" required />
      </div>
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
    <div class="mt-4 text-center text-sm">
      Already have an account?
      <a href="/sign-in" class="underline">Sign In</a>
    </div>
  </Card.Content>
</Card.Root>
