import { z } from "zod";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";
import { chatEntry } from "$lib/server/db/schema";
import { generateToken } from "$lib/server/auth";

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

  let requestData;

  try {
    requestData = await request.json();
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({
        status: 400,
        message: "Invalid request body format",
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const result = requestSchema.safeParse(requestData);
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
