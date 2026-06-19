import type { APIRoute } from "astro";
import { createAuth } from "../../../auth";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
	const D1Database = env.DB;
	if (!D1Database) {
		return new Response("D1 database not found", { status: 500 });
	}
	const auth = createAuth(D1Database);
	return auth.handler(ctx.request);
};

export const ALL: APIRoute = async (ctx) => {
  	// If you want to use rate limiting, make sure to set the 'x-forwarded-for' header to the request headers from the context
	// ctx.request.headers.set("x-forwarded-for", ctx.clientAddress);
	const D1Database = env.DB;
	if (!D1Database) {
		return new Response("D1 database not found", { status: 500 });
	}
	const auth = createAuth(D1Database);
	return auth.handler(ctx.request);
}; 