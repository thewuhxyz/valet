<script lang="ts">
	import { link } from "svelte-spa-router";

	const options = [
		{
			name: "Transfer Delegate",
			href: "/ota/transfer-delegate",
		},
	];
</script>

<div class="w-full max-w-3xl my-4 bg-accent flex flex-col">
	{#each options as { href, name }, i}
		<a
			class={`w-full p-3   card-default border-b-2 ${i === 0 && "border-t-2"} border-0`}
			use:link
			{href}
		>
			<div class="flex w-full text-base">
				{name}
			</div>
		</a>
	{/each}
</div>
