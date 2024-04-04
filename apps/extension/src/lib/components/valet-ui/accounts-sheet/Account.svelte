<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { truncate } from "$lib/helpers";

	let className: string = ""
	export {className as class}

	export let account: [string, string] | undefined
	export let selected = false

	let [publicKey, name] = account ? account : ["", "No Active Wallet"]
	
</script>

<button
	class={`flex w-full items-center rounded-lg p-1 my-2 ${selected ? "card-active" : "card-default"} ${className} `}
	on:click
	on:keydown
>
	<Avatar.Root class="mr-3">
		<Avatar.Fallback class="hover:cursor-default text-primary text-lg"
			>{name[0]}</Avatar.Fallback
		>
	</Avatar.Root>
	<div class="flex-1 text-left">
		<p class="text-base">{name}</p>
		<p class="text">{truncate(publicKey)}</p>
	</div>
</button>
