<script lang="ts">
	import NavBar from "$lib/components/valet-ui/NavBar.svelte";
	import AppBar from "$lib/components/valet-ui/home/AppBar.svelte"
	import { HomeHero } from "@valet/ui";
	</script>

<AppBar />
<HomeHero />

<div class="flex-1-y-scroll flex flex-col max-w-3xl items-center w-full">
	<NavBar />
	<div class="flex-1-y-scroll w-full flex flex-col items-center">
		<slot />
	</div>
</div>
