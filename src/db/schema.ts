import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at"),
}, (table) => ({
  emailIdx: index("idx_users_email").on(table.email),
}));

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expires_at: text("expires_at").notNull(),
  created_at: text("created_at"),
}, (table) => ({
  userIdIdx: index("idx_sessions_user_id").on(table.user_id),
  tokenIdx: index("idx_sessions_token").on(table.token),
  expiresAtIdx: index("idx_sessions_expires_at").on(table.expires_at),
}));

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  hero_image_url: text("hero_image_url"),
  body_mdxl: text("body_mdxl").notNull(),
  pub_date: text("pub_date").notNull(),
  created_at: text("created_at"),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Post = typeof posts.$inferSelect;
