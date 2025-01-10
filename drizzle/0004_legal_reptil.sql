ALTER TABLE "chatHistory" RENAME TO "chat_history";--> statement-breakpoint
ALTER TABLE "chat_history" DROP CONSTRAINT "chatHistory_user_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
