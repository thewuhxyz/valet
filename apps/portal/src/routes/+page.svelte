<script lang="ts">
	import SignInButton from "$lib/components/app/SignInButton.svelte"
	import { GithubLogo } from "radix-icons-svelte"
	import { Separator } from "$lib/components/ui/separator"
	import { Button } from "$lib/components/ui/button"
</script>

<div
	class="
  w-full min-h-screen justify-center
  p-2 space-y-8 mx-auto flex flex-col
  items-center h-full max-w-3xl"
>
	<div class="text-right italic">
		<img
			src="/valet-hero-logo-white.svg"
			alt="valet-hero-logo-white"
			width="360"
		/>
		<p class="text-lg pr-4">Developer Portal</p>
	</div>
	<div class="flex space-x-4 justify-between">
		<div class="flex flex-col justify-center w-full items-end space-y-4">
			<p class="opacity-60 cursor-default border-0 border-b-2 border-primary">
				Projects Dashboard
			</p>
			<SignInButton provider="github">
				<GithubLogo slot="icon" />
				<p slot="text">Sign in with Github</p>
			</SignInButton>
		</div>
		<Separator orientation="vertical" class="bg-primary h-20" />
		<div class="flex flex-col justify-center w-full items-start space-y-4">
			<p class="opacity-60 cursor-default border-0 border-b-2 border-primary">Docs</p>
			<Button variant="secondary">Read the Docs</Button>
		</div>
	</div>
</div>
