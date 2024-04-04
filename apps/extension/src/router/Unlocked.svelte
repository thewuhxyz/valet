<script lang="ts">
	import Router, {
		replace,
		type RouteLoadedEvent,
		type RouteLoadingEvent,
	} from "svelte-spa-router"
	import Send from "../pages/Send.svelte"
	import Token from "../pages/Token.svelte"
	import Recent from "../pages/Recent.svelte"
	import ApproveOrigin from "../pages/ApproveOrigin.svelte"
	import ApproveMessage from "../pages/ApproveMessage.svelte"
	import ApproveTransaction from "../pages/ApproveTransaction.svelte"
	import NotFound from "../pages/NotFound.svelte"
	import Tokens from "../pages/Tokens.svelte"
	import Ota from "../pages/Ota.svelte"
	import TransferDelegate from "../pages/TransferDelegate.svelte"

	const routes = {
		"/": Tokens,
		"/token": Tokens,
		"/token/:id": Token,
		"/token/:id/send": Send,
		"/recent": Recent,
		"/approve-origin": ApproveOrigin,
		"/approve-message": ApproveMessage,
		"/approve-transaction": ApproveTransaction,
		"/ota": Ota,
		"/ota/transfer-delegate": TransferDelegate,
		"*": NotFound,
	}

	function routeLoading(event: RouteLoadingEvent) {
		if (event.detail.route === "/" || event.detail.route === "#/") {
			replace("#/token")
		}
	}

	function routeLoaded(event: RouteLoadedEvent) {
		if (event.detail.component === NotFound) {
			replace("/")
		}
	}
</script>

<Router on:routeLoading={routeLoading} on:routeLoaded={routeLoaded} {routes} />
