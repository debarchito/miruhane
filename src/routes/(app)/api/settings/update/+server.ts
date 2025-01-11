import { z } from "zod";
import { db } from "$lib/server/db";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { userSetting } from "$lib/server/db/schema";

const headers = {
  "Content-Type": "application/json",
};

const settingsSchema = z.array(
  z.object({
    key: z.string(),
    value: z.string(),
  }),
);

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
  const result = settingsSchema.safeParse(body);

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

  await db.transaction(async (trx) => {
    for (const { key, value } of result.data) {
      await trx
        .update(userSetting)
        .set({ value })
        .where(and(eq(userSetting.userId, locals.session!.userId), eq(userSetting.key, key)));
    }
  });

  return new Response(
    JSON.stringify({
      status: 200,
      message: "Settings updated",
    }),
    {
      status: 200,
      headers,
    },
  );
};
