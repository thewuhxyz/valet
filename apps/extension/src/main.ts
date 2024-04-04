import "./app.pcss";
import { setupClient } from "@valet/background";
import { notificationsHandler } from "$lib/notifications";
import App from "./App.svelte";

setupClient(notificationsHandler); 
const app = new App({
	target: document.getElementById("app")!,
});

export default app;
