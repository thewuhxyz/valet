<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { TitleBar } from "@valet/ui";
	import { ArrowLeft } from "radix-icons-svelte";
	import { location, pop } from "svelte-spa-router";
	import OtaSwitch from "./OtaSwitch.svelte";

	$: sub = $location.split("/").pop()?.replace("-", " ").toUpperCase();
</script>

<TitleBar>
	<div slot="left" class="">
		<Button variant="ghost" size="icon" on:click={pop}>
			<ArrowLeft />
		</Button>
	</div>
	<div slot="main" class="flex-1 text-center">
		<div class="flex justify-center items-center space-x-3">
			<p class="text-lg">OTA</p>
			{#if sub === "OTA"}
				<OtaSwitch />
			{/if}
		</div>
		<p>{sub === "OTA" ? "" : sub}</p>
	</div>
	<slot name="right" slot="right" />
</TitleBar>
