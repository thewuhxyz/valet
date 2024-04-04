<script lang="ts">
	import Separator from "$lib/components/ui/separator/separator.svelte";
</script>

<div class="w-full">
	<Separator class="my-2 bg-primary" />
	<div class="flex flex-col item-center justify-center bg-primary text-secondary text-center p-1 h-20">
		<slot name="main" />
		<slot name="sub" />
	</div>
	<Separator class="my-2 bg-primary" />
</div>
