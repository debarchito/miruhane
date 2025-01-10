DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('user', 'miruhane');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chatHistory" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"content" text NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chatHistory" ADD CONSTRAINT "chatHistory_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chat_role" ON "chatHistory" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chat_user_id" ON "chatHistory" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chat_created_at" ON "chatHistory" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chat_user_id_created_at" ON "chatHistory" USING btree ("user_id","created_at");