<script lang="ts">
	import * as Sheet from "$lib/components/ui/sheet";
	import { Archive } from "radix-icons-svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import SelectAccount from "./SelectAccount.svelte";
	import ActiveAccount from "./ActiveAccount.svelte";
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<Button class="border-primary" variant="outline" size="icon">
			<Archive />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col pb-0 p-2 pt-4" side="right">
		<div>
			<div>Active Account</div>
			 <ActiveAccount />
		</div>
		<div class="flex-1-y-scroll">
			<Separator class="bg-primary" />
			<div class="mt-1">Select Account</div>
			<SelectAccount />
		</div>
		<div>
			<Button variant="secondary" class="cta-btn">
				Import Account
			</Button>
		</div>
	</Sheet.Content>
</Sheet.Root>
