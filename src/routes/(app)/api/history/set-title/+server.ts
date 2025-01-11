import { z } from "zod";
import { db } from "$lib/server/db";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { history } from "$lib/server/db/schema";

const headers = {
  "Content-Type": "application/json",
};
const requestSchema = z.object({
  historyId: z.string(),
  title: z.string(),
});

export const GET: RequestHandler = async ({ locals, request }) => {
  if (!locals.session) {
    return new Response(
      JSON.stringify({
        res: null,
        status: 403,
        message: "Action not allowed",
      }),
      {
        status: 403,
        headers,
      },
    );
  }

  const body = await request.json();
  const result = requestSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        res: null,
        status: 400,
        message: "Invalid request body",
        errors: result.error.errors,
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const { historyId, title } = result.data;

  const res = await db
    .update(history)
    .set({
      title,
    })
    .where(and(eq(history.userId, locals.session.userId), eq(history.id, historyId)))
    .returning();

  return new Response(
    JSON.stringify({
      res: res[0],
      status: 200,
      message: "History retrieved",
    }),
    {
      status: 200,
      headers,
    },
  );
};
