<script lang="ts">
	import { link } from "svelte-spa-router"
	import { buttonVariants } from "$lib/components/ui/button"
	import Button from "$lib/components/ui/button/button.svelte"
	import Input from "$lib/components/ui/input/input.svelte"
	import ActionButtonArea from "$lib/components/valet-ui/ActionButtonArea.svelte"
	import type { NewUserFormData } from "$lib/types"
	import { getLogger } from "@valet/lib"

	const logger = getLogger("new user form")

	let steps = ["create-mnemonic", "create-password"]
	let currentStep = 0
	let words: string[]
	let formData: NewUserFormData = {
		password: "",
		confirm: "",
		mnemonic: "",
		secret: "",
		hint: "",
	}

	$: isFinalStep = currentStep === steps.length - 1
	$: isFirstStep = currentStep === 0
	$: shouldGenerateMnemonic =
		steps[currentStep] === "create-mnemonic" && !formData.mnemonic
	$: words = !formData.mnemonic ? [] : formData.mnemonic.split(" ")
	$: formData

	const nextStep = () => {
		if (currentStep < steps.length - 1) {
			currentStep = currentStep + 1
		}
	}
	const previousStep = () => {
		if (currentStep > 0) {
			currentStep = currentStep - 1
		}
	}

	const handleNext = async () => {
		if (isFinalStep) {
			await handleSubmit(formData.mnemonic, formData.password)
		} else if (shouldGenerateMnemonic) {
			formData.mnemonic = await generateMnemonic()
		} else {
			nextStep()
		}
	}

	const handlePrev = () => {
		previousStep()
	}
	export let generateMnemonic: () => Promise<string>
	export let handleSubmit: (mnemonic: string, password: string) => Promise<void>
</script>

<form class="w-full px-4 flex flex-col items-center">
	{#if steps[currentStep] == "create-password"}
		<Input
			class="w-80 my-1"
			name="password"
			type="password"
			placeholder="Create New Password"
			bind:value={formData.password}
		/>
		<Input
			class="w-80 my-1"
			name="confirm-password"
			type="password"
			placeholder="Confirm Password"
			bind:value={formData.confirm}
		/>
	{:else if steps[currentStep] == "create-mnemonic"}
		<div class="grid grid-cols-3 w-full">
			{#each words as word, i}
				<div class=" text-sm text-center border m-1 p-1 rounded-sm">
					{i + 1}. {word}
				</div>
			{/each}
		</div>
		<a class={` ${buttonVariants({ variant: "link" })}`} href="/login" use:link>
			Import instead?
		</a>
	{:else if steps[currentStep] == "finish"}
		<Input
			class="w-80 my-1"
			name="secret"
			type="text"
			placeholder="Create Secret (Optional)"
			bind:value={formData.secret}
		/>
		<Input
			class="w-80 my-1"
			name="hint"
			type="text"
			placeholder="Create hint (Optional)"
			bind:value={formData.hint}
		/>
	{/if}
	<ActionButtonArea>
		<Button class="cta-btn" on:click={handleNext}
			>{isFinalStep
				? "Finish"
				: shouldGenerateMnemonic
					? "Create New Wallet"
					: "Continue"}</Button
		>
		<Button
			class={`cta-btn ${isFirstStep ? "hidden" : ""}`}
			on:click={handlePrev}>Back</Button
		>
	</ActionButtonArea>
</form>
