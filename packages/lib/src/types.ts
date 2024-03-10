export type Notification = {
	name: string;
	data?: any;
};

export type Background = {
	_serverUi: Handle;
	_solanaConnection: Handle;
	_serverInjected?: Handle;
};

export type Handle = any;


export type Context<Backend> = {
	sender: Sender;
	backend: Backend;
	events: EventEmitter;
};


export type RpcRequest = {
	id?: number;
	method: string;
	params: any[];
};

export type RpcResponse<T = any> = any;
export type ResponseHandler = [any, any];
export type EventEmitter = any;
export type Event = any;

export type Sender = {
	id: string;
	url: string;

	origin?: string;

	documentId?: string;
	documentLifeCycle?: string;
	frameId?: number;
	tab?: {
		active: boolean;
		audible: boolean;
		autoDiscardable: boolean;
		favIconUrl: string;
		groupId: number;
		height: number;
		highlighted: boolean;
		id: number;
		incognito: boolean;
		index: number;
		mutedInfo: {
			muted: boolean;
		};
		pinned: boolean;
		selected: boolean;
		status: string;
		title: string;
		url: string;
		width: number;
		windowId: number;
	};
};

export type RpcResponseData = {
  id?: string;
  error?: any;
  result?: any;
};
