import { createAuth } from "../auth";

export function getAuth(context: { locals: { env?: { DB?: D1Database } } }) {
  // @ts-ignore - Astro v6+ Cloudflare adapter provides env directly on locals
  const D1Database = context.locals.env?.DB;
  
  if (!D1Database) {
    throw new Error("D1 database not found in context");
  }
  
  return createAuth(D1Database);
}
