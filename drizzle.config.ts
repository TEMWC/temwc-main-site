import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
    databaseId: "5197ccdf-392a-41d8-b4c8-b923c1022202",
    token: process.env.CLOUDFLARE_API_TOKEN || "",
  },
} satisfies Config;
