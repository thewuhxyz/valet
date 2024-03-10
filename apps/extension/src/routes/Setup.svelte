<script lang="ts">
	import Router from "svelte-spa-router";
	import Login from "../pages/Login.svelte";
	import NewUser from "../pages/NewUser.svelte";
	import ExistingUser from "../pages/ExistingUser.svelte";
	import { userStore } from "$lib/stores/user-store";
	import { mnemonicStore } from "$lib/stores/mnemonic-store";

	const loginRoute = { "/": Login };
	const existingUserRoute = { "/": ExistingUser };
	const newUserRoute = { "/": NewUser };
</script>

<div>
	{#if $userStore && $mnemonicStore}
		<Router routes={existingUserRoute} />
	{:else if $userStore}
		<Router routes={newUserRoute} />
	{:else}
		<Router routes={loginRoute} />
	{/if}
</div>
