<script lang="ts">
	import { OAuth2Client } from "google-auth-library"
	import {
		PUBLIC_APP_DOMAIN,
		PUBLIC_PROJECT_GOOGLE_ID,
	} from "$env/static/public"
	import Button from "$lib/components/ui/button/button.svelte"
	import { userStore } from "$lib/stores"

	const oauth2client = new OAuth2Client({
		clientId: PUBLIC_PROJECT_GOOGLE_ID,
		redirectUri: `${PUBLIC_APP_DOMAIN}/auth/callback`,
	})

	$: signInUrl = oauth2client.generateAuthUrl({
		access_type: "offline",
		scope: "openid email profile",
	})
</script>

<Button
	class={`${$userStore && "opacity-60 cursor-default"}`}
	href={!$userStore ? signInUrl : undefined}
>
	{$userStore ? `Signed in as ${$userStore.name}` : "Sign In With Google"}
</Button>
