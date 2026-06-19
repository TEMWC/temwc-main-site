declare namespace Cloudflare {
	interface Env {
		DB: D1Database;
		BUCKET: R2Bucket;
	}
}

declare namespace App {
	interface Locals {
		user: import("better-auth").User | null;
		session: import("better-auth").Session | null;
	}
}
