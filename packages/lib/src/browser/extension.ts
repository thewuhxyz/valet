import {
	EXTENSION_HEIGHT,
	EXTENSION_WIDTH,
} from "../constants";
import { BrowserRuntimeCommon } from "./common";
import { UiActionRequestManager } from "./uiActionRequestManager";


export class BrowserRuntimeExtension {
	public static getUrl(scriptName: string): string {
		return chrome.runtime.getURL(scriptName);
	}

	public static sendMessageActiveTab(msg: any) {
		return chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
			if (tab?.id) chrome.tabs.sendMessage(tab.id, msg);
		});
	}

	public static sendMessageTab(tabId: number, msg: any) {
		chrome.tabs.sendMessage(tabId, msg);
	}

	public static async openTab(
		options: chrome.tabs.CreateProperties
	): Promise<chrome.tabs.Tab> {
		return new Promise((resolve, reject) => {
			chrome?.tabs.create(options, (newWindow) => {
				const error = BrowserRuntimeCommon.checkForError();
				if (error) {
					return reject(error);
				}
				return resolve(newWindow);
			});
		});
	}

	public static async addTabUpdateListener(listener: TabListener) {
		chrome.tabs.onUpdated.addListener(listener);
	}

	public static async removeTabUpdateListener(listener: TabListener) {
		chrome.tabs.onUpdated.removeListener(listener);
	}

	public static async openTabWithUpdateListener(
		options: chrome.tabs.CreateProperties,
		listener: TabListener
	) {
		await BrowserRuntimeExtension.removeTabUpdateListener(listener);
		chrome?.tabs.create(options, (tab) => {
			const error = BrowserRuntimeCommon.checkForError();
			if (error) {
				throw error;
			}
			BrowserRuntimeExtension.addTabUpdateListener(listener);
		});
	}

	static async _openWindow(options: chrome.windows.CreateData) {
		await UiActionRequestManager.cancelAllRequests();
		const newPopupWindow = await chrome?.windows.create(options);
		return newPopupWindow;
	}

	public static async getLastFocusedWindow(): Promise<chrome.windows.Window>;
	public static async getLastFocusedWindow() {
		return new Promise((resolve) => {
			chrome.windows.getLastFocused(resolve);
		});
	}

	public static activeTab(): Promise<chrome.tabs.Tab>;
	public static activeTab() {
		return new Promise((resolve) => {
			chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
				resolve(tab);
			});
		});
	}

	public static closeActiveTab(): void {
		chrome.tabs.getCurrent((tab) => {
			if (tab?.id) chrome.tabs.remove(tab.id, function () {});
		});
	}

	public static closeWindow(id: number) {
		chrome.windows.remove(id);
	}
}

////////////////////////////////////////////////////////////////////////////////
// Open window APIs.
////////////////////////////////////////////////////////////////////////////////

const POPUP_HTML = "src/index.html";
const LOCKED = "locked";
const LOCKED_APPROVE_ORIGIN = "locked-approve-origin";
const APPROVE_ORIGIN = "approve-origin";
const APPROVE_TRANSACTION = "approve-transaction";
const APPROVE_MESSAGE = "approve-message";

export async function openLockedApprovalPopupWindow(
	origin: string,
	requestId: string
): Promise<chrome.windows.Window> {
	const url = `${POPUP_HTML}#/${LOCKED_APPROVE_ORIGIN}?origin=${origin}&requestId=${requestId}`;
	return openPopupWindow(url);
}

export async function openLockedPopupWindow(
	origin: string,
	requestId: string
): Promise<chrome.windows.Window> {
	const url = `${POPUP_HTML}#/${LOCKED}?origin=${origin}&requestId=${requestId}`;
	return openPopupWindow(url);
}

export async function openApprovalPopupWindow(
	origin: string,
	requestId: string
): Promise<chrome.windows.Window> {
	const url = `${POPUP_HTML}#/${APPROVE_ORIGIN}?origin=${origin}&requestId=${requestId}`;
	return openPopupWindow(url);
}

export async function openApproveTransactionPopupWindow(
	origin: string,
	requestId: string,
	tx: string
): Promise<chrome.windows.Window> {
	const url = `${POPUP_HTML}#/${APPROVE_TRANSACTION}?origin=${origin}&requestId=${requestId}&tx=${tx}`;
	return await openPopupWindow(url);
}

export async function openApproveMessagePopupWindow(
	origin: string,
	requestId: string,
	message: string
): Promise<chrome.windows.Window> {
	const url = `${POPUP_HTML}#/${APPROVE_MESSAGE}?origin=${origin}&requestId=${requestId}&message=${message}`;
	return await openPopupWindow(url);
}

async function openPopupWindow(url: string): Promise<chrome.windows.Window> {
	return new Promise((resolve, reject) => {
		BrowserRuntimeExtension.getLastFocusedWindow().then((window: any) => {
			BrowserRuntimeExtension._openWindow({
				url: `${url}`,
				type: "popup",
				width: EXTENSION_WIDTH,
				height: EXTENSION_HEIGHT + (isMacOs() ? MACOS_TOOLBAR_HEIGHT : 0),
				top: window.top,
				left: window.left + (window.width - EXTENSION_WIDTH),
				focused: true,
			}).then((window: any) => {
				resolve(window);
			});
		});
	});
}

function getOs() {
	const os = ["Windows", "Linux", "Mac"];
	return os.find((v) => navigator.appVersion.indexOf(v) >= 0);
}

function isMacOs(): boolean {
	return getOs() === "Mac";
}

const MACOS_TOOLBAR_HEIGHT = 28;

export type TabListener = (
	tabId: number,
	changeInfo: chrome.tabs.TabChangeInfo,
	tab: chrome.tabs.Tab
) => void;
