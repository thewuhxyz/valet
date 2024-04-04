<script lang=ts>
	import Separator from "../ui/separator/separator.svelte";

	let twClass = ""
	export let separator = true;
	export  { twClass as class }
</script>

<div class={`pb-2 w-full flex flex-col items-center ${twClass}`}>
	<Separator class={`${separator ? "" : "hidden"} m-1 bg-primary`} />
	<slot />
</div>
