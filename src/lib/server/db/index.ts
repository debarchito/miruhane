import postgres from "postgres";
import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/postgres-js";

if (!env.POSTGRES_USER) throw new Error("Postgres user is not set");
if (!env.POSTGRES_PASSWORD) throw new Error("Postgres password is not set");

const url = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@0.0.0.0:5432/miruhanedb`;
const client = postgres(url);
export const db = drizzle(client);

