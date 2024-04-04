<script lang="ts">
	import Router, { replace, type RouteLoadedEvent } from "svelte-spa-router"
	import Unlock from "../pages/Unlock.svelte"
	import ApproveOrigin from "../pages/ApproveOrigin.svelte"
	import ApproveTransaction from "../pages/ApproveTransaction.svelte"
	import ApproveMessage from "../pages/ApproveMessage.svelte"
	import NotFound from "../pages/NotFound.svelte"
	const routes = {
		"/": Unlock,
		"/approve-origin": ApproveOrigin,
		"/approve-message": ApproveMessage,
		"/approve-transaction": ApproveTransaction,
		"*": NotFound,
	}

	function routeLoaded(event: RouteLoadedEvent) {
		if (event.detail.component === NotFound) {
			replace("/")
		}
	}
</script>

<Router on:routeLoaded={routeLoaded} {routes} />
