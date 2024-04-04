<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index.js"

	export let title: string, desc: string
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<slot name="trigger" />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{desc}
			</Dialog.Description>
		</Dialog.Header>
		<slot name="form" />
	</Dialog.Content>
</Dialog.Root>
