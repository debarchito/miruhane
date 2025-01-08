ALTER TABLE "session" ALTER COLUMN "id" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "user_id" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE varchar(64);