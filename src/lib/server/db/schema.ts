import { pgTable, varchar, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    // usernames don't have to be unique; uniqueness is enforced by the id and email
    username: varchar("username", { length: 32 }).notNull(),
    // RFC 5321, SMTP Protocol, limits the email address to 254 characters
    email: varchar("email", { length: 254 }).notNull(),
    passwordHash: varchar("password_hash", { length: 98 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    idxUserEmail: uniqueIndex("idx_user_email").on(table.email),
  }),
);

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 })
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => ({
    idxSessionUserId: index("idx_session_user_id").on(table.userId),
  }),
);

export const userSetting = pgTable(
  "user_setting",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 })
      .notNull()
      .references(() => user.id),
    // not using a enum because I want to be able to add new settings without changing the schema
    // this schema design is fine for the testing phase
    key: varchar("key", { length: 64 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    idxUserSettingUserId: index("idx_user_setting_user_id").on(table.userId),
  }),
);

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type UserSetting = typeof userSetting.$inferSelect;
