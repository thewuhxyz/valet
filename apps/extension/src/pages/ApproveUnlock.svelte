<script lang="ts">
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import Hero from "$lib/components/valet-ui/Hero.svelte";
	import EnterPassword from "$lib/components/valet-ui/EnterPassword.svelte";
	import { BackgroundRequest, UiResponse } from "$lib/background-client";

	import { URLSearchParams } from "url";
	import { querystring } from "svelte-spa-router";

	const search = new URLSearchParams($querystring)

	const requestId = search.get("requestId");
	const origin = search.get("origin");


	let handleSubmit = async (password: string) => {
		await BackgroundRequest.unlock(password)
		await UiResponse.locked(requestId!, true);
	};

</script>

<PageContainer class="flex flex-col">
	<Hero class="flex-1" />
	origin: {origin}
	<EnterPassword {handleSubmit} />
</PageContainer>
