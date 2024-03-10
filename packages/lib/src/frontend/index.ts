import { Context, RpcRequest, RpcResponse, EventEmitter, Sender } from "../types";

// Utility to transform the handler API into something a little more friendly.
export function withContext<Backend>(
	backend: Backend,
	events: EventEmitter,
	handler: (ctx: Context<Backend>, req: RpcRequest) => Promise<RpcResponse>
): ({ data }: { data: RpcRequest }, sender: any) => Promise<RpcResponse> {
	return async ({ data }: { data: RpcRequest }, sender: any) => {
		const ctx = { backend, events, sender };
		return await handler(ctx, data);
	};
}

export function withContextPort<Backend>(
	backend: Backend,
	events: EventEmitter,
	handler: (ctx: Context<Backend>, req: RpcRequest) => Promise<RpcResponse>
): (data: RpcRequest, sender: Sender) => Promise<RpcResponse> {
	return async (data: RpcRequest, sender: Sender) => {
		const ctx = { backend, events, sender };
		return await handler(ctx, data);
	};
}

