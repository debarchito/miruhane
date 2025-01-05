import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: varchar("id", { length: 32 }).primaryKey(),
  // usernames don't have to be unique; uniqueness is enforced by the id and email
  username: varchar("username", { length: 32 }).notNull(),
  // RFC 5321, SMTP Protocol, limits the email address to 254 characters
  email: varchar("email", { length: 254 }).notNull().unique(),
  // default output length is 32 + 1/3 of 32 = 43
  passwordHash: varchar("password_hash", { length: 43 }).notNull(),
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
