<script lang="ts">
	import Router, { replace, type RouteLoadedEvent } from "svelte-spa-router"
	import Login from "../pages/Login.svelte"
	import NewUser from "../pages/NewUser.svelte"
	import ExistingUser from "../pages/ExistingUser.svelte"
	import { walletStore } from "$lib/stores"
	import NotFound from "../pages/NotFound.svelte"
	import Logging from "../pages/Logging.svelte"

	const loginRoute = { "/": Login, "/signing": Logging, "*": NotFound }
	const existingUserRoute = { "/": ExistingUser, "*": NotFound }
	const newUserRoute = { "/": NewUser, "*": NotFound }

	function routeLoaded(event: RouteLoadedEvent) {
		if (event.detail.component === NotFound) {
			replace("/")
		}
	}

	$: ({ user } = walletStore)
	$: ({ isInited, isMnemonicInDb } = user)
</script>

{#if $isInited}
	{#if $isMnemonicInDb && $user}
		<Router on:routeLoaded={routeLoaded} routes={existingUserRoute} />
	{:else if $user}
		<Router on:routeLoaded={routeLoaded} routes={newUserRoute} />
	{:else}
		<Router on:routeLoaded={routeLoaded} routes={loginRoute} />
	{/if}
{:else}
	Loading...
{/if}
