CREATE TABLE IF NOT EXISTS "session" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"username" varchar(32) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"username" varchar(32) NOT NULL,
	"email" varchar(254) NOT NULL,
	"password_hash" varchar(256) NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_username_user_id_fk" FOREIGN KEY ("username") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
