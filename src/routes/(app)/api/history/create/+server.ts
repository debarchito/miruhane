import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";
import { history } from "$lib/server/db/schema";
import { generateToken } from "$lib/server/auth";

const headers = {
  "Content-Type": "application/json",
};

export const POST: RequestHandler = async ({ locals }) => {
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

  const res = await db
    .insert(history)
    .values({
      id: generateToken(),
      userId: locals.session.userId,
      title: "New",
    })
    .returning();

  return new Response(
    JSON.stringify({
      res: res[0],
      status: 200,
      message: "History created",
    }),
    {
      status: 200,
      headers,
    },
  );
};
