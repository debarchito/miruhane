import { z } from "zod";
import { db } from "$lib/server/db";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { history } from "$lib/server/db/schema";

const headers = {
  "Content-Type": "application/json",
};
const createSchema = z.object({
  historyId: z.string(),
});

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.session) {
    return new Response(
      JSON.stringify({
        status: 403,
        message: "Action not allowed",
      }),
      {
        status: 403,
        headers,
      },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        status: 400,
        message: "Invalid JSON body",
      }),
      {
        status: 400,
        headers,
      },
    );
  }
  const result = createSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: result.error.errors[0].message,
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  await db
    .delete(history)
    .where(and(eq(history.userId, locals.session.userId), eq(history.id, result.data.historyId)));

  return new Response(
    JSON.stringify({
      status: 200,
      message: "History deleted",
    }),
    {
      status: 200,
      headers,
    },
  );
};
