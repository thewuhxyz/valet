<script lang="ts">
	let className: string = "";
	export { className as class };
</script>

<section
	class={`
	min-w-[360px] w-full h-[100vh] 
	min-h-[600px] pt-2  px-2 flex 
	flex-col items-center ${className}`}
>
	<slot />
</section>
