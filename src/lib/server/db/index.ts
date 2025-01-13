import postgres from "postgres";
import * as schema from "./schema.js";
import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/postgres-js";

if (!env.POSTGRES_USER) throw new Error("Postgres user is not set");
if (!env.POSTGRES_DB) throw new Error("Postgres database is not set");
if (!env.POSTGRES_PASSWORD) throw new Error("Postgres password is not set");

const url = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@0.0.0.0:5432/${env.POSTGRES_DB}`;
const client = postgres(url);
export const db = drizzle(client, { schema });
