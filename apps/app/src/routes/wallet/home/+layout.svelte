<script lang="ts">
	import { HomeHero } from "@valet/ui"
	import HomeNav from "$lib/components/app/HomeNav.svelte"
</script>

<HomeHero />
<div class=" w-full max-w-3xl items-center flex flex-col">
	<HomeNav />
	<slot />
</div>
