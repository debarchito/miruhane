import { z } from "zod";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";
import { generateToken } from "$lib/server/auth";
import { chatEntry } from "$lib/server/db/schema";

const headers = {
  "Content-Type": "application/json",
};
const requestSchema = z.object({
  historyId: z.string(),
  content: z.string(),
  role: z.enum(["user", "miruhane"]),
  createdAt: z.string().datetime(),
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
  const result = requestSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: result.error.message,
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const { historyId, content, role, createdAt } = result.data;

  await db.insert(chatEntry).values({
    id: generateToken(),
    historyId,
    content,
    role,
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
  });

  return new Response(
    JSON.stringify({
      status: 200,
      message: "Chat entry added",
    }),
    {
      status: 200,
      headers,
    },
  );
};
