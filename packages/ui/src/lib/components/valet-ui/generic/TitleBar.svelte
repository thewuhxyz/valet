<script lang=ts>
	let className = ""
	export {className as class}
</script>

<div class={`flex items-center justify-between max-w-3xl w-full ${className}`}>
	<div class="flex w-full">
		<slot name="left" />
	</div>

	<div class="w-full max-w-sm text-center">
		<slot name="main" />
	</div>

	<div class="flex justify-end w-full">
		<slot name="right" />
	</div>
</div>
