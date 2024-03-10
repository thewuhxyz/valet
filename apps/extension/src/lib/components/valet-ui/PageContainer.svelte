<script lang="ts">
	let className: string = "";
	export { className as class };
</script>

<section class={`w-[360px] h-[600px] pt-2  px-2 flex flex-col items-center ${className}`}>
	<slot />
</section>
