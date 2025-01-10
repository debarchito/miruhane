import { sql, relations } from "drizzle-orm";
import { pgTable, varchar, timestamp, uniqueIndex, index, pgEnum, text } from "drizzle-orm/pg-core";

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

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  userSettings: many(userSetting),
  histories: many(history),
}));

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => ({
    idxSessionUserId: index("idx_session_user_id").on(table.userId),
  }),
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const userSetting = pgTable(
  "user_setting",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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

export const userSettingRelations = relations(userSetting, ({ one }) => ({
  user: one(user, { fields: [userSetting.userId], references: [user.id] }),
}));

export const history = pgTable(
  "history",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    idxHistoryUserId: index("idx_history_user_id").on(table.userId),
    idxHistoryCreatedAt: index("idx_history_created_at").on(table.createdAt),
    idxHistoryUserIdCreatedAt: index("idx_history_user_id_created_at").on(
      table.userId,
      table.createdAt,
    ),
    idxTitleSearch: index("idx_title_search").using(
      "gin",
      sql`to_tsvector('english', ${table.title})`,
    ),
  }),
);

export const historyRelations = relations(history, ({ one, many }) => ({
  user: one(user, { fields: [history.userId], references: [user.id] }),
  chatEntries: many(chatEntry),
}));

export const role = pgEnum("role", ["user", "miruhane"]);
export const chatEntry = pgTable(
  "chat_entry",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    historyId: varchar("history_id", { length: 64 })
      .notNull()
      .references(() => history.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    role: role("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => ({
    idxChatRole: index("idx_chat_role").on(table.role),
    idxChatHistoryId: index("idx_chat_history_id").on(table.historyId),
    idxChatCreatedAt: index("idx_chat_created_at").on(table.createdAt),
    idxChatRoleHistoryId: index("idx_chat_role_history_id").on(table.role, table.historyId),
    idxChatHistoryIdCreatedAt: index("idx_chat_history_id_created_at").on(
      table.historyId,
      table.createdAt,
    ),
    idxContentSearch: index("idx_content_search").using(
      "gin",
      sql`to_tsvector('english', ${table.content})`,
    ),
  }),
);

export const chatEntryRelations = relations(chatEntry, ({ one }) => ({
  history: one(history, { fields: [chatEntry.historyId], references: [history.id] }),
}));

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type UserSetting = typeof userSetting.$inferSelect;
export type History = typeof history.$inferSelect;
export type ChatEntry = typeof chatEntry.$inferSelect;
