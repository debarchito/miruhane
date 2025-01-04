import { defineConfig } from "drizzle-kit";

if (!process.env.POSTGRES_USER) throw new Error("Postgres user is not set");
if (!process.env.POSTGRES_PASSWORD) throw new Error("Postgres password is not set");

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: "0.0.0.0",
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "miruhanedb"
  },
  verbose: true,
  strict: true
});
