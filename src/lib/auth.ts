import { createAuth } from "../auth";
import { env } from "cloudflare:workers";

export function getAuth() {
  const D1Database = env.DB;
  
  if (!D1Database) {
    throw new Error("D1 database not found in context");
  }
  
  return createAuth(D1Database);
}
