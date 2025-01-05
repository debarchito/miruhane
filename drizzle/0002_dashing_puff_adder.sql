ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_email";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_email" ON "user" USING btree ("email");