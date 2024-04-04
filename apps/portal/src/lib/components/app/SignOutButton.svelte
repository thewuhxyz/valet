<script>
	import { goto } from "$app/navigation"
	import { Button } from "$lib/components/ui/button"

	const signOut = async () => {
		const res = await fetch("/auth/signout")
		const { success } = await res.json()
		if (success) goto("/")
	}
</script>

<Button
	class="text-foreground/60 h-5 p-2 hover:bg-primary hover:text-destructive"
	variant="ghost"
	size="sm"
	on:click={signOut}
>
	Sign out
</Button>
