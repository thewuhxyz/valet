<script lang="ts">
	import PageContainer from "$lib/components/valet-ui/PageContainer.svelte";
	import NavBar from "$lib/components/valet-ui/NavBar.svelte";
	import AppBar from "$lib/components/valet-ui/home/AppBar.svelte";
	import AppHero from "$lib/components/valet-ui/home/AppHero.svelte";
	import FtList from "$lib/components/valet-ui/token/FtList.svelte";
</script>

<PageContainer>
	<AppBar />
	<AppHero />

	<div class="flex-1-y-scroll flex flex-col w-full">
		<NavBar />
		<div class="flex-1-y-scroll">
			<FtList />
		</div>
	</div>
</PageContainer>
