<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Sheet from "$lib/components/ui/sheet";
	import Send from "../../../../pages/Send.svelte";

</script>

<Sheet.Root>
  <Sheet.Trigger>
    <Button class="cta-btn">Send</Button>
		
	</Sheet.Trigger>
	<Sheet.Content class="" side="bottom">
		<Send params={{id: ""}} />
	</Sheet.Content>
</Sheet.Root>
