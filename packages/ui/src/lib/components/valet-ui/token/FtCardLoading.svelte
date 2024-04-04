<script>
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte"
	let className = ""
	export { className as class }
</script>

<div class={`flex w-full h-12 p-1 ${className}`}>
	<Skeleton class="p-4 w-12 h-12 rounded-full mx-2 mr-4 " />
	<div class="h-12 flex flex-col w-full justify-between">
		<div class="flex justify-between w-full">
			<Skeleton class="w-24 h-4 rounded-xl" />
			<Skeleton class="w-24 h-4 rounded-xl" />
		</div>
		<Skeleton class="w-32 h-4 rounded-xl" />
	</div>
</div>
