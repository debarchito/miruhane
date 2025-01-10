import { db } from "$lib/server/db";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { userSetting } from "$lib/server/db/schema";

const headers = {
  "Content-Type": "application/json",
};

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

  const body: {
    key: string;
    value: string;
  }[] = await request.json();

  await db.transaction(async (trx) => {
    for (const { key, value } of body) {
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
