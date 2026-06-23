**The common pain point here is how timestamps/datetimes are handled between Better Auth (which works with `Date` objects internally) and Drizzle + D1 (SQLite).** D1 doesn't have a true native `DATETIME` type, so Drizzle encourages `integer` columns with `mode: 'timestamp'` (or `'timestamp_ms'`) for proper Date handling in your TS code.

### Quick Fix / Recommended Schema Approach

Run the Better Auth CLI to generate the schema first (this is the easiest starting point):

```bash
npx auth@latest generate
```

Then, **manually adjust** (or override) the timestamp fields in your Drizzle schema files (usually in the generated `authentication.ts` or your custom schema) to use the D1-friendly integer mode.

Example for key tables like `user`, `session`, etc.:

```ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  // ... other fields

  // Use this pattern for timestamps
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),  // or .defaultNow() if it works in your setup

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),  // or similar default
});

// Same for session, account, verification, etc.
```

**Key points for D1 + Drizzle timestamps:**
- `integer(..., { mode: 'timestamp' })` → Treated as `Date` in your TS code, stored as Unix timestamp (seconds) in DB.
- `mode: 'timestamp_ms'` for milliseconds if needed.
- Avoid plain `text()` or `timestamp()` (the PG-style one) for D1 — it can cause mismatches.
- Defaults: `sql`(unixepoch())` works reliably in D1.

### Drizzle Adapter Config

When setting up the adapter, specify SQLite provider:

```ts
import { drizzleAdapter } from "@better-auth/drizzle-adapter";  // or from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",   // Important!
    // schema: yourSchemaObject,  // if using custom/plural/camelCase
    // camelCase: true, etc.
  }),
  // ...
});
```

Make sure your Drizzle DB instance is correctly initialized with D1:

```ts
import { drizzle } from "drizzle-orm/d1";

export const db = drizzle(platform.env.DB);  // or however you bind it in Workers/Hono/SvelteKit
```

### Common Gotchas & Tips

- **Schema mismatches** after `auth generate`: The generated schema might use PG-style `timestamp()` or expect string dates. Override the timestamp columns as shown above.
- **Migrations**: Use `drizzle-kit generate` + `wrangler d1 migrations apply` (not Better Auth's built-in for Drizzle). Test locally first.
- **Date parsing errors** (e.g., `toISOString is not a function`): Often fixed by ensuring your schema columns return proper `Date` objects via the `mode: 'timestamp'`. Recent Better Auth versions improved Drizzle date handling.
- **Cloudflare specifics**: D1 works great with the Drizzle adapter + `provider: "sqlite"`. There are good community guides for Hono/SvelteKit setups if you're hitting binding or singleton issues.

If you share the exact error message, your current schema snippet for a timestamp field, or how you're initializing the DB/adapter, I can give a more targeted fix. This stack (Drizzle + Better Auth + D1) works well once the timestamp modes are aligned.
