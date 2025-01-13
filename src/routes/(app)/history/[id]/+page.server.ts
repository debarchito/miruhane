import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

type Response = {
  res: {
    chatEntries: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      historyId: string;
      content: string;
      role: "user" | "miruhane";
    }[];
    id: string;
    createdAt: Date;
    userId: string;
    updatedAt: Date;
    title: string;
  };
  meta: {
    count: number;
    hasMore: boolean;
    nextCursor: Date | null;
    pageSize: number;
  };
};

export const load: PageServerLoad = async ({ locals, params, fetch }) => {
  if (!locals.session) {
    return redirect(302, "/sign-in");
  }

  try {
    const history = await db.query.history.findFirst({
      where: (histories, { eq, and }) =>
        and(eq(histories.userId, locals.session!.userId), eq(histories.id, params.id)),
      columns: {
        createdAt: true,
      },
    });

    if (!history) {
      return redirect(302, "/history");
    }

    const body = await fetch("/api/history/retrieve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        historyId: params.id,
        cursor: history.createdAt,
        pageSize: 10,
        direction: "next",
        order: "asc",
      }),
    });

    if (!body.ok) {
      throw new Error("Failed to fetch history");
    }

    const res: Response = await body.json();

    if (!res.res) {
      return redirect(302, "/history");
    }

    return {
      user: locals.user!,
      session: locals.session,
      res: res.res,
      meta: res.meta,
    };
  } catch (error) {
    console.error("Error loading history:", error);
    return redirect(302, "/history");
  }
};
