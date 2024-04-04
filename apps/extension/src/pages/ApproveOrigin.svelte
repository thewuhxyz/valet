<script lang="ts">
	import { UiResponse } from "$lib/background-client";
	import { URLSearchParams } from "url";
	import { querystring } from "svelte-spa-router";
	import ApprovePage from "./ApprovePage.svelte";

	const search = new URLSearchParams($querystring);

	const requestId = search.get("requestId");
	const origin = search.get("origin");

	let handleApproveOrigin = async () => {
		await UiResponse.approveOrigin(requestId!, true);
	};
	let handleCancel = async () => {
		await UiResponse.approveOrigin(requestId!, false);
	};
</script>

<ApprovePage
	handleApprove={handleApproveOrigin}
	{handleCancel}
	buttonText={"Approve Origin"}
	subject={"Approve Origin"}
>
	<p class="text-base">Approve origin: {origin}?</p>
</ApprovePage>
