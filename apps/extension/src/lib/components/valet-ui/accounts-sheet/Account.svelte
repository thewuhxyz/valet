<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { truncate } from "$lib/helpers";
	export let account: [string, string] | undefined

	let [publicKey, name] = account ? account : ["", "No Active Wallet"]
	
	export let selected = false
</script>

<div
	class={`flex w-full items-center ${selected ? "card-active" : "card-default"} rounded-lg p-1 my-2`}
>
	<Avatar.Root class="mr-3">
		<Avatar.Fallback class="hover:cursor-default text-primary text-lg"
			>{name[0]}</Avatar.Fallback
		>
	</Avatar.Root>
	<div class="flex-1">
		<p class="text-base">{name}</p>
		<p class="text">{truncate(publicKey)}</p>
	</div>
</div>
