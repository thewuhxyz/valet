import { EventEmitter } from "eventemitter3";
import * as serverUi from "../frontend/server-ui";
import * as serverInjected from "../frontend/server-injected";
import * as solanaConnection from "../frontend/solana-connection";
import * as coreBackend from "../backend/core";
import * as solanaConnectionBackend from "../backend/solana";
import { Background } from "../types";
//
// Entry: Starts the background service.
//
export function startBackgroundService(): Background {
	// Shared event message bus.
	const events = new EventEmitter();

	// Backend.
	const solanaB = solanaConnectionBackend.start(events);
	const coreB = coreBackend.start(events, solanaB);

	// Frontend.
	const _serverUi = serverInjected.start(events, coreB);
	const _serverInjected = serverUi.start(events, coreB);
	const _solanaConnection = solanaConnection.start(events, solanaB);

	if (chrome && chrome?.runtime?.id) {
		// Keep alive for Manifest V3 service worker
		chrome.runtime.onInstalled.addListener(() => {
			chrome.alarms.get("keep-alive", (a) => {
				if (!a) {
					chrome.alarms.create("keep-alive", { periodInMinutes: 0.1 });
				}
			});
		});
	}

	// Add a noop listener to the alarm. Without this, the service worker seems
	// to be deemed as idle by Chrome and will be killed after 30s.
	chrome.alarms.onAlarm.addListener(() => {
		// Noop
		Function.prototype();
	});

	return {
		_serverUi,
		_serverInjected,
		_solanaConnection,
	};
}
