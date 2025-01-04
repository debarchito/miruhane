import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: varchar("id", { length: 32 }).primaryKey(),
  // usernames don't have to be unique; uniqueness is enforced by the id and email
  username: varchar("username", { length: 32 }).notNull(),
  // RFC 5321, SMTP Protocol, limits the email address to 254 characters
  email: varchar("email", { length: 254 }).notNull().unique(),
  // 16 bytes is enough for an argon2id hash, but we went with 32 bytes either way
  passwordHash: varchar("password_hash", { length: 256 }).notNull(),
});

export const session = pgTable("session", {
  id: varchar("id", { length: 32 }).primaryKey(),
  userId: varchar("username", { length: 32 })
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
