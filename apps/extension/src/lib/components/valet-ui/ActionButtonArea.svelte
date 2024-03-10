<script lang=ts>
	import Separator from "../ui/separator/separator.svelte";

	let className = ""
	export let separator = true;
	export  { className as class }
</script>

<div class={`pb-2 w-full flex flex-col items-center ${className}`}>
	<Separator class={`${separator ? "" : "hidden"} m-1 bg-primary`} />
	<slot />
</div>
