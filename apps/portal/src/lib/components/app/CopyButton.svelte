<script lang="ts">
	import { Copy } from "radix-icons-svelte"

	let className = ""
	let text: string

	export { className as class, text }

	const copy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
		} catch {}
	}
</script>

<button
	on:click={() => copy(text)}
	class={`flex space-x-1 text-xs p-2 ${className}`}
>
	<Copy />
</button>
