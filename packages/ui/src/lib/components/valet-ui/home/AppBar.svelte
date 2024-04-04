<script lang="ts">
	import TitleBar from "../generic/TitleBar.svelte";
	import svg from "$lib/components/valet-hero-logo-white.svg";
</script>

<TitleBar>
	<a slot="left" href="/">
		<img class="w-32" src={svg} alt="home">
	</a>
  <slot name=main slot="main" />
  <slot name=right slot="right" />
</TitleBar>
