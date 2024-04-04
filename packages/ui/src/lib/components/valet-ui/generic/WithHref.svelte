<script lang="ts">
	export let href: string;
	let className = "";
	export { className as class };
</script>

<a class={`${className}`} {href}>
	<slot />
</a>
