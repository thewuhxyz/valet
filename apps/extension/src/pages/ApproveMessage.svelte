<script lang="ts">
	import { UiResponse } from "$lib/background-client";
	import { URLSearchParams } from "url";
	import { querystring } from "svelte-spa-router";
	import ApprovePage from "./ApprovePage.svelte";
	import { decode } from "bs58";
	import { parseSignInMessage } from "@solana/wallet-standard-util";


	const search = new URLSearchParams($querystring);

	const requestId = search.get("requestId");
	const message = search.get("message");

	let handleCancel = async () => {
		await UiResponse.approveOrigin(requestId!, false);
	};

	let handleApproveMessage = async () => {
		await UiResponse.approveMessage(requestId!, true);
	};


	const parseMessage = (message: string | null) => {
		if (!message) return;
		const some = parseSignInMessage(decode(message));
		if (!some) return;
		return some;
	};

	const parsedMessage = parseMessage(message);
</script>

<ApprovePage
	handleApprove={handleApproveMessage}
	{handleCancel}
	buttonText={"Sign Message"}
	subject={"Sign Message"}
>
	<div>
		{#if parsedMessage}
			{#each Object.entries(parsedMessage) as [name, value]}
				{#if value}
					<div class="">
						{name}: {value}
					</div>
				{/if}
			{/each}
		{/if}
	</div>
</ApprovePage>
