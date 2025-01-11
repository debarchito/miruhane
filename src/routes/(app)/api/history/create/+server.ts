import { z } from "zod";
import { db } from "$lib/server/db";
import { randomBytes } from "node:crypto";
import type { RequestHandler } from "./$types";
import { history } from "$lib/server/db/schema";
import { generateToken } from "$lib/server/auth";

const headers = {
  "Content-Type": "application/json",
};
const createSchema = z.object({
  title: z.string().min(1).max(249), // Reduced max length to accommodate salt
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

  let body;
  try {
    body = await request.json();
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        res: null,
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
        res: null,
        status: 400,
        message: result.error.errors[0].message,
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const { title } = result.data;
  const salt = randomBytes(3).toString("hex");
  const saltedTitle = `${title}_${salt}`;

  const res = await db
    .insert(history)
    .values({
      id: generateToken(),
      userId: locals.session.userId,
      title: saltedTitle,
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
