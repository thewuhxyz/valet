<script lang="ts">
	import Input from "$lib/components/ui/input/input.svelte"
	import * as Select from "$lib/components/ui/select/index.js"
	import { truncate } from "$lib/helpers"
	import { walletStore } from "$lib/stores"
	import ActionButtonArea from "../ActionButtonArea.svelte"
	import OtaTransferDelegateButton from "./OtaTransferDelegateButton.svelte"

	$: ({ allKeys, otaWallet } = walletStore)

	$: password = ""
	$: from = ""
	$: to = ""
	$: selectFrom = { value: "" }
	$: selectTo = { value: "" }
</script>

allkeys:{$allKeys}
{#if $allKeys}
	from: {from}
	to: {to}
	otaWallet: {$otaWallet}
	<div class="flex flex-col mt-4 space-y-4 w-full h-full sm:h-min max-w-sm">
		<Select.Root
			selected={selectFrom}
			onSelectedChange={(v) => {
				v && (from = v.value)
			}}
		>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="From" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each Array.from($allKeys.entries()) as [publicKey, name]}
						<Select.Item value={publicKey} label={name}>
							<div>
								<p class="text-base">
									{publicKey !== $otaWallet ? name : "OTA SERVER"}
								</p>
								<p class="text-sm">
									{publicKey !== $otaWallet ? truncate(publicKey) : ""}
								</p>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input bind:value={from} name="transfer-from" />
		</Select.Root>

		<Select.Root
			selected={selectTo}
			onSelectedChange={(v) => {
				v && (to = v.value)
			}}
		>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="To" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each Array.from($allKeys.entries()) as [publicKey, name]}
						<Select.Item value={publicKey} label={name}>
							<div>
								<p class="text-base">
									{publicKey !== $otaWallet ? name : "OTA SERVER"}
								</p>
								<p class="text-sm">
									{publicKey !== $otaWallet ? truncate(publicKey) : ""}
								</p>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input bind:value={to} name="transfer-to" />
		</Select.Root>
		<Input
			class="max-w-sm"
			placeholder="Enter OTA Password"
			bind:value={password}
		/>
	</div>

	<ActionButtonArea class="max-w-sm mt-1">
		<OtaTransferDelegateButton {password} {from} {to} />
	</ActionButtonArea>
{:else}
	Loading...
{/if}
