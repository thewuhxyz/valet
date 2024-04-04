<script lang="ts">
	import { link } from "svelte-spa-router";
	import OtaSwitch from "./OtaSwitch.svelte";

	export let href: string;

	let className: string = "";
	export { className as class };
</script>

<div
	class={`flex w-full p-2 py-3 hover:bg-foreground/20 justify-between ${className}`}
>
	<a class="w-full flex-1" use:link {href}>
		<p class="text-base">OTA</p>
	</a>
	<OtaSwitch />
</div>
