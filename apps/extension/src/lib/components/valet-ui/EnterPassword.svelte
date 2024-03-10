<script lang="ts">
	import { link } from "svelte-spa-router";
	import { buttonVariants } from "$lib/components/ui/button";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import ActionButtonArea from "./ActionButtonArea.svelte";
	import Label from "../ui/label/label.svelte";

	let password: string = "";
	export let buttonText: string = "Unlock";
	export let handleSubmit: (password: string) => void;
</script>

<form
	class="px-4 flex flex-col items-center w-full"
	on:submit|preventDefault={() => handleSubmit(password)}
>
	<Label for="password" class="w-full">
		<Input
			class="my-1 focus:border-primary"
			name="password"
			type="password"
			placeholder="Enter Password"
			bind:value={password}
		/>
	</Label>
	<ActionButtonArea>
		<Button type="submit" class="cta-btn">{buttonText}</Button>
		<a class={` ${buttonVariants({ variant: "link" })}`} href="/" use:link>
			Forgot Password?
		</a>
	</ActionButtonArea>
</form>
