import { z } from "zod";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";

const headers = {
  "Content-Type": "application/json",
};
const requestSchema = z.object({
  historyId: z.string(),
});

export const POST: RequestHandler = async ({ locals, request }) => {
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

  const { historyId } = result.data;

  const res = await db.query.history.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.userId, locals.session!.userId), eq(table.id, historyId)),
    with: {
      chatEntries: true,
    },
  });

  if (!res) {
    return new Response(
      JSON.stringify({
        res: null,
        status: 404,
        message: "History not found",
      }),
      {
        status: 404,
        headers,
      },
    );
  }

  return new Response(
    JSON.stringify({
      res,
      status: 200,
      message: "History retrieved",
    }),
    {
      status: 200,
      headers,
    },
  );
};
