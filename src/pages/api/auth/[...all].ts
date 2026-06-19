import type { APIRoute } from "astro";
import { createAuth } from "../../../auth";

export const GET: APIRoute = async (ctx) => {
	// @ts-ignore - Astro v6+ Cloudflare adapter provides env directly on locals
	const D1Database = ctx.locals.env?.DB;
	if (!D1Database) {
		return new Response("D1 database not found", { status: 500 });
	}
	const auth = createAuth(D1Database);
	return auth.handler(ctx.request);
};

export const ALL: APIRoute = async (ctx) => {
  	// If you want to use rate limiting, make sure to set the 'x-forwarded-for' header to the request headers from the context
	// ctx.request.headers.set("x-forwarded-for", ctx.clientAddress);
	// @ts-ignore - Astro v6+ Cloudflare adapter provides env directly on locals
	const D1Database = ctx.locals.env?.DB;
	if (!D1Database) {
		return new Response("D1 database not found", { status: 500 });
	}
	const auth = createAuth(D1Database);
	return auth.handler(ctx.request);
}; 