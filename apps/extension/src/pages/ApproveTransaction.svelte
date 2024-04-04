<script lang="ts">
	import {  UiResponse } from "$lib/background-client";
	import { URLSearchParams } from "url";
	import { querystring } from "svelte-spa-router";
	import ApprovePage from "./ApprovePage.svelte";

	const search = new URLSearchParams($querystring);

	const requestId = search.get("requestId");
	const origin = search.get("origin");
	const tx = search.get("tx");

	
	let handleApproveTransaction = async () => {
		await UiResponse.approveTransaction(requestId!, true, tx!);
	};
	
	let handleCancel = async () => {
		await UiResponse.approveTransaction(requestId!, false, tx!);
	};
</script>

<ApprovePage
	handleApprove={handleApproveTransaction}
	{handleCancel}
	buttonText={"Approve Transaction"}
	subject={"Approve Transaction"}
>
	<p class="text-base">Origin: {origin}?</p>
	<p class="text-base">Sign Transaction: {tx}?</p>
</ApprovePage>
