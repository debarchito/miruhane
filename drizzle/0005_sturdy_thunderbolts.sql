ALTER TABLE "chat_history" ADD COLUMN "title" varchar(256) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_title_search" ON "chat_history" USING gin (to_tsvector('english', "title"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_search" ON "chat_history" USING gin (to_tsvector('english', "content"));