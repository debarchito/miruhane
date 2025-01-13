import { z } from "zod";
import { desc } from "drizzle-orm";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";

const headers = {
  "Content-Type": "application/json",
};
const requestSchema = z.object({
  historyId: z.string(),
  cursor: z.string().datetime().nullable().optional(),
  pageSize: z.number().int().min(1).max(20).default(5),
  direction: z.enum(["next", "prev"]).default("next"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.session) {
    return new Response(
      JSON.stringify({
        res: null,
        meta: null,
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
        meta: null,
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
        res: null,
        meta: null,
        status: 400,
        message: result.error.errors,
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const { historyId, cursor, pageSize, direction, order } = result.data;

  const res = await db.query.history.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.userId, locals.session!.userId), eq(table.id, historyId)),
    with: {
      chatEntries: {
        limit: pageSize + 1,
        where: cursor
          ? (fields, { lt, gt }) =>
              direction === "next"
                ? gt(fields.createdAt, new Date(cursor))
                : lt(fields.createdAt, new Date(cursor))
          : undefined,
        orderBy: (fields) => (order === "desc" ? [desc(fields.createdAt)] : [fields.createdAt]),
      },
    },
  });

  if (!res) {
    return new Response(
      JSON.stringify({
        res: null,
        meta: null,
        status: 404,
        message: "History not found",
      }),
      {
        status: 404,
        headers,
      },
    );
  }

  const hasMore = res.chatEntries.length > pageSize;
  const entries = hasMore ? res.chatEntries.slice(0, -1) : res.chatEntries;
  const nextCursor = hasMore ? entries[entries.length - 1].createdAt : null;

  return new Response(
    JSON.stringify({
      res: { ...res, chatEntries: entries },
      meta: {
        count: entries.length,
        hasMore,
        nextCursor,
        pageSize,
      },
      status: 200,
      message: "History retrieved",
    }),
    {
      status: 200,
      headers,
    },
  );
};
