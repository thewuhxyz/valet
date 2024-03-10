<script lang="ts">
	import Router from "svelte-spa-router";
	import Unlock from "../pages/Unlock.svelte";
	import ApproveOrigin from "../pages/ApproveOrigin.svelte";
	import ApproveUnlock from "../pages/ApproveUnlock.svelte";
	import ApproveTransaction from "../pages/ApproveTransaction.svelte";
	import ApproveMessage from "../pages/ApproveMessage.svelte";
	const routes = {
		"/": Unlock,
		"/approve-origin": ApproveOrigin,
		"/approve-message": ApproveMessage,
		"/locked": ApproveUnlock,
		"/approve-transaction": ApproveTransaction
	};
</script>

<div>
	<Router {routes} />
</div>
