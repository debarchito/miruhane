import { z } from "zod";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";

const headers = {
  "Content-Type": "application/json",
};
const schema = z.object({
  limit: z.number(),
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
  const result = schema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        res: null,
        status: 400,
        message: "Invalid request body",
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const res = await db.query.history.findMany({
    where: (table, { eq }) => eq(table.userId, locals.session!.userId),
    limit: result.data.limit,
  });

  return new Response(
    JSON.stringify({
      res,
      status: 200,
      message: "History listed",
    }),
    {
      status: 200,
      headers,
    },
  );
};
