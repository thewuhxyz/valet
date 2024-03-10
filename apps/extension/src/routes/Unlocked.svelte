<script lang="ts">
	import Router from "svelte-spa-router";
	import Home from "../pages/Home.svelte";
	import Send from "../pages/Send.svelte";
	import Token from "../pages/Token.svelte";
	import Recent from "$lib/components/valet-ui/Recent.svelte";
	import ApproveOrigin from "../pages/ApproveOrigin.svelte";
	import ApproveMessage from "../pages/ApproveMessage.svelte";
	import ApproveTransaction from "../pages/ApproveTransaction.svelte";

	const routes = {
		"/": Home,
		"/token/:id": Token,
		"/token/:id/send": Send,
		"/recent": Recent,
		"/approve-origin": ApproveOrigin,
		"/approve-message": ApproveMessage,
		"/approve-transaction": ApproveTransaction
	};
</script>

<div>
	<Router {routes} />
</div>
