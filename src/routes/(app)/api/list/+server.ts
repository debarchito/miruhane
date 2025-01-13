import { z } from "zod";
import { desc } from "drizzle-orm";
import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";
import { history } from "$lib/server/db/schema";

const headers = {
  "Content-Type": "application/json",
};
const schema = z.object({
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
  const result = schema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        res: null,
        meta: null,
        status: 400,
        message: result.error.message,
      }),
      {
        status: 400,
        headers,
      },
    );
  }

  const { cursor, pageSize, direction, order } = result.data;
  const limit = pageSize;

  const res = await db.query.history.findMany({
    where: cursor
      ? (fields, { eq, and, lt, gt }) =>
          and(
            eq(fields.userId, locals.session!.userId),
            direction === "next"
              ? lt(fields.updatedAt, new Date(cursor))
              : gt(fields.updatedAt, new Date(cursor)),
          )
      : (fields, { eq }) => eq(fields.userId, locals.session!.userId),
    orderBy: [
      direction === "next"
        ? order === "desc"
          ? desc(history.updatedAt)
          : history.updatedAt
        : history.updatedAt,
    ],
    limit: limit + 1,
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

  const hasMore = res.length > limit;
  const items = hasMore ? res.slice(0, -1) : res;
  const nextCursor = hasMore ? res[res.length - 2].updatedAt : null;

  return new Response(
    JSON.stringify({
      res: items,
      meta: {
        count: items.length,
        hasMore,
        nextCursor,
        pageSize,
      },
      status: 200,
      message: "History listed",
    }),
    {
      status: 200,
      headers,
    },
  );
};
