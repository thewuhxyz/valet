<script lang="ts">
	import CopyButton from "./CopyButton.svelte";
	let className: string = "";
	export { className as class };

	export let text: string;

	export let hidden: boolean = false;

	function hideText(text: string, force?: number) {
		return "✶".repeat(force ? force : text.length);
	}
</script>

<div class={`space-x-2 items-center w-full flex h-full  ${className}`}>
	<p>{!hidden ? text : hideText(text, 16)}</p>
	<CopyButton
		class="p-1 text-foreground/60 hover:text-foreground/80 rounded-md hover:bg-accent"
		{text}
	/>
</div>
