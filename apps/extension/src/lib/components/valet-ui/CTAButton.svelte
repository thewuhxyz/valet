<script lang="ts">
	import Button from "../ui/button/button.svelte";

	let className: string = "" 
	export {className as class}
</script>

<Button class={`w-80 h-12 text-lg ${className}`}>
 <slot/>
</Button>